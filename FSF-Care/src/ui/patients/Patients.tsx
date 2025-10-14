import React, { useContext, useEffect, useState } from "react";
import {
	View,
	Text,
	Button,
	FlatList,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
} from "react-native";
import { AuthContext } from "@/src/context/AuthContext";
import { getPatientsByUser } from "@/src/firebase/patientService";
import { Patient } from "@/src/types";
import { useRouter } from "expo-router";

export default function PatientsScreen() {
	const { user } = useContext(AuthContext);
	const [patients, setPatients] = useState<{ id: string; data: Patient }[]>(
		[]
	);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		if (!user) return;

		const fetch = async () => {
			setLoading(true);
			try {
				const docs = await getPatientsByUser(user.uid);
				setPatients(docs);
			} catch (err) {
				console.error("Erro ao buscar pacientes:", err);
			} finally {
				setLoading(false);
			}
		};
		fetch();
	}, [user]);

	const handleAdd = () => {
		router.push("/patients/form");
	};

	if (loading) {
		return (
			<View
				style={[
					styles.container,
					{ justifyContent: "center", alignItems: "center" },
				]}
			>
				<ActivityIndicator size="large" color="#0000ff" />
				<Text>Carregando pacientes...</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Pacientes</Text>
			<FlatList
				data={patients}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<TouchableOpacity
						onPress={() =>
							router.push(`/admin/patients/${item.id}`)
						}
					>
						<View style={styles.item}>
							<Text style={styles.name}>{item.data.name}</Text>
							<Text>{item.data.documentId}</Text>
						</View>
					</TouchableOpacity>
				)}
			/>
			<Button title="Adicionar Paciente" onPress={handleAdd} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
	item: { padding: 12, borderBottomWidth: 1, borderColor: "#ccc" },
	name: { fontWeight: "bold" },
});
