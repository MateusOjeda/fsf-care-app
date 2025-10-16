import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	ActivityIndicator,
	Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getPatientById, deletePatient } from "@/src/firebase/patientService";
import { Patient } from "@/src/types";
import BackHeader from "@/src/components/BackHeader";
import Avatar from "@/src/components/Avatar";
import ButtonPrimary from "@/src/components/ButtonPrimary";
import colors from "@/src/theme/colors";

export default function PatientDetails() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const [patient, setPatient] = useState<Patient | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!id) return;

		const fetchPatient = async () => {
			try {
				const data = await getPatientById(id);
				if (!data) {
					Alert.alert("Erro", "Paciente não encontrado");
					router.back();
					return;
				}
				setPatient(data);
			} catch (err) {
				console.error(err);
				Alert.alert("Erro", "Não foi possível carregar o paciente");
			} finally {
				setLoading(false);
			}
		};

		fetchPatient();
	}, [id]);

	const handleEdit = () => {
		if (!id) return;
		router.push({ pathname: "/patients/form", params: { id } });
	};

	const handleDelete = () => {
		if (!id) return;
		Alert.alert(
			"Confirmação",
			"Tem certeza que deseja deletar este paciente?",
			[
				{ text: "Cancelar", style: "cancel" },
				{
					text: "Deletar",
					style: "destructive",
					onPress: async () => {
						try {
							await deletePatient(id);
							Alert.alert("Sucesso", "Paciente deletado!");
							router.replace("/admin/patients");
						} catch (err) {
							console.error(err);
							Alert.alert(
								"Erro",
								"Não foi possível deletar o paciente"
							);
						}
					},
				},
			]
		);
	};

	if (loading) {
		return (
			<View style={styles.center}>
				<ActivityIndicator size="large" color={colors.primary} />
			</View>
		);
	}

	if (!patient) {
		return (
			<View style={styles.center}>
				<Text>Paciente não encontrado</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<BackHeader
				title="Perfil do Paciente"
				onPress={() => router.replace(`/admin/patients`)}
			/>
			<ScrollView contentContainerStyle={styles.containerScroll}>
				<Avatar photoURL={patient.photoURL} size={120} />

				<View style={styles.card}>
					<Text style={styles.label}>Nome:</Text>
					<Text style={styles.value}>{patient.name}</Text>
				</View>

				<View style={styles.card}>
					<Text style={styles.label}>Data de nascimento:</Text>
					<Text style={styles.value}>
						{patient.birthDate
							? new Date(patient.birthDate).toLocaleDateString()
							: "-"}
					</Text>
				</View>

				<View style={styles.card}>
					<Text style={styles.label}>Documento:</Text>
					<Text style={styles.value}>
						{patient.documentId || "-"}
					</Text>
				</View>

				<View style={styles.card}>
					<Text style={styles.label}>Telefone:</Text>
					<Text style={styles.value}>{patient.phone || "-"}</Text>
				</View>

				<View style={styles.card}>
					<Text style={styles.label}>Endereço:</Text>
					<Text style={styles.value}>{patient.address || "-"}</Text>
				</View>

				<View style={styles.card}>
					<Text style={styles.label}>Observações:</Text>
					<Text style={styles.value}>{patient.notes || "-"}</Text>
				</View>

				<ButtonPrimary
					title="Editar paciente"
					onPress={handleEdit}
					color={colors.primary}
				/>

				<ButtonPrimary
					title="Deletar paciente"
					onPress={handleDelete}
					color={colors.danger}
				/>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	containerScroll: {
		alignItems: "center",
		paddingHorizontal: 16,
		paddingTop: 20,
		paddingBottom: 10,
	},
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	center: { flex: 1, justifyContent: "center", alignItems: "center" },
	card: {
		width: "100%",
		backgroundColor: colors.cardBackground,
		padding: 12,
		borderRadius: 10,
		marginVertical: 6,
		borderWidth: 1,
		borderColor: colors.border,
	},
	label: { fontWeight: "bold", color: colors.textPrimary, marginBottom: 4 },
	value: { color: colors.textSecondary },
});
