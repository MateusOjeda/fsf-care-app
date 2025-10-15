import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	TextInput,
	FlatList,
	TouchableOpacity,
	ActivityIndicator,
	Button,
	StyleSheet,
} from "react-native";
import { fetchPatients } from "@/src/firebase/patientService";
import { Patient } from "@/src/types";
import { useRouter } from "expo-router";

export default function PatientsScreen() {
	const [patients, setPatients] = useState<{ id: string; data: Patient }[]>(
		[]
	);
	const [filtered, setFiltered] = useState<{ id: string; data: Patient }[]>(
		[]
	);
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const fetch = async () => {
			setLoading(true);
			try {
				const docs = await fetchPatients();
				setPatients(docs);
				setFiltered(docs);
			} catch (err) {
				console.error("Erro ao buscar pacientes:", err);
			} finally {
				setLoading(false);
			}
		};
		fetch();
	}, []);

	// 🔍 Atualiza lista conforme busca
	useEffect(() => {
		if (!search.trim()) {
			setFiltered(patients);
			return;
		}
		const lower = search.toLowerCase();
		setFiltered(
			patients.filter(
				(p) =>
					p.data.name?.toLowerCase().includes(lower) ||
					p.data.documentId?.toLowerCase().includes(lower)
			)
		);
	}, [search, patients]);

	const handleAdd = () => router.push("/patients/form");

	if (loading) {
		return (
			<View style={styles.center}>
				<ActivityIndicator size="large" />
				<Text>Carregando pacientes...</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Pacientes</Text>

			<TextInput
				style={styles.search}
				placeholder="Buscar por nome ou documento..."
				value={search}
				onChangeText={setSearch}
			/>

			<FlatList
				data={filtered}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<TouchableOpacity
						onPress={() =>
							router.push(`/admin/patients/${item.id}`)
						}
					>
						<View style={styles.item}>
							<Text style={styles.name}>{item.data.name}</Text>
							<Text style={styles.sub}>
								{item.data.documentId}
							</Text>
						</View>
					</TouchableOpacity>
				)}
				refreshing={loading}
				onRefresh={async () => {
					setLoading(true);
					const docs = await fetchPatients();
					setPatients(docs);
					setFiltered(docs);
					setLoading(false);
				}}
			/>

			<Button title="Adicionar Paciente" onPress={handleAdd} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
	search: {
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 8,
		padding: 10,
		marginBottom: 12,
	},
	item: {
		padding: 12,
		borderBottomWidth: 1,
		borderColor: "#eee",
	},
	name: { fontWeight: "bold", fontSize: 16 },
	sub: { color: "#555" },
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
