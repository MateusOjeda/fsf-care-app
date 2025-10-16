import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	TextInput,
	FlatList,
	TouchableOpacity,
	ActivityIndicator,
	StyleSheet,
} from "react-native";
import { fetchPatients } from "@/src/firebase/patientService";
import { Patient } from "@/src/types";
import { useRouter } from "expo-router";
import Avatar from "@/src/components/Avatar";
import { differenceInYears } from "date-fns";

const colors = {
	background: "#F6F4EE",
	textPrimary: "#2F3E46",
	textSecondary: "#52796F",
	primary: "#3D8361",
	border: "#D3D3D3",
	cardBackground: "#E8E5DD",
	white: "#fff",
};

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

	useEffect(() => {
		if (!search.trim()) {
			setFiltered(patients);
			return;
		}
		const lower = search.toLowerCase();
		setFiltered(
			patients.filter((p) => p.data.name?.toLowerCase().includes(lower))
		);
	}, [search, patients]);

	const handleAdd = () => router.push("/patients/form");

	if (loading) {
		return (
			<View style={styles.center}>
				<ActivityIndicator size="large" color={colors.primary} />
				<Text style={styles.loadingText}>Carregando pacientes...</Text>
			</View>
		);
	}

	const getAge = (birthDate?: Date) => {
		if (!birthDate) return "-";
		return differenceInYears(new Date(), new Date(birthDate)) + " anos";
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Pacientes</Text>

			<TextInput
				style={styles.search}
				placeholder="Buscar por nome..."
				value={search}
				onChangeText={setSearch}
				placeholderTextColor={colors.textSecondary}
			/>

			<FlatList
				data={filtered}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<TouchableOpacity
						onPress={() =>
							router.push(`/admin/patients/${item.id}`)
						}
						activeOpacity={0.7}
					>
						<View style={styles.item}>
							<Avatar
								photoURL={item.data.photoThumbnailURL}
								size={60}
								borderWidth={1}
								borderColor={colors.border}
							/>
							<View style={styles.info}>
								<Text style={styles.name}>
									{item.data.name}
								</Text>
								<Text style={styles.sub}>
									{getAge(item.data.birthDate)}
								</Text>
							</View>
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

			<TouchableOpacity style={styles.addButton} onPress={handleAdd}>
				<Text style={styles.addButtonText}>Adicionar Paciente</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
		paddingHorizontal: 16,
		paddingTop: 30,
		paddingBottom: 10,
	},
	title: {
		fontSize: 22,
		fontWeight: "600",
		color: colors.textPrimary,
		marginBottom: 12,
	},
	search: {
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 10,
		padding: 12,
		marginBottom: 12,
		backgroundColor: colors.white,
		color: colors.textPrimary,
	},
	item: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.cardBackground,
		padding: 12,
		borderRadius: 12,
		marginBottom: 10,
		borderWidth: 1,
		borderColor: colors.border,
		shadowColor: "#000",
		shadowOpacity: 0.05,
		shadowRadius: 4,
		shadowOffset: { width: 0, height: 2 },
		elevation: 2,
	},
	info: { marginLeft: 12, flex: 1 },
	name: { fontWeight: "600", fontSize: 16, color: colors.textPrimary },
	sub: { color: colors.textSecondary, fontSize: 14 },
	center: { flex: 1, justifyContent: "center", alignItems: "center" },
	addButton: {
		backgroundColor: colors.primary,
		borderRadius: 10,
		paddingVertical: 16,
		alignItems: "center",
		marginTop: 12,
	},
	addButtonText: {
		color: colors.white,
		fontWeight: "600",
		fontSize: 16,
	},
	loadingText: {
		marginTop: 12,
		fontSize: 16,
		color: colors.textSecondary,
		fontWeight: "500",
		textAlign: "center",
	},
});
