import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	Alert,
	ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getPatientById } from "@/src/firebase/patientService";
import { Patient } from "@/src/types";
import BackHeader from "@/src/components/BackHeader";
import Avatar from "@/src/components/Avatar";
import ButtonPrimary from "@/src/components/ButtonPrimary";
import colors from "@/src/theme/colors";
import CareSheetModal from "@/src/ui/patients/CareSheetModal";

type PatientDetailsProps = {};

const mockAppointments = [
	{
		id: "1",
		date: "2025-01-15",
		professional: "Dr. João Silva",
		notes: "Consulta de rotina",
	},
	{
		id: "2",
		date: "2025-02-20",
		professional: "Dra. Maria Souza",
		notes: "Retorno para ajustes",
	},
];

export default function PatientDetails({}: PatientDetailsProps) {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const [patient, setPatient] = useState<Patient | null>(null);
	const [loading, setLoading] = useState(true);
	const [careSheetVisible, setCareSheetVisible] = useState(false);

	useEffect(() => {
		if (!id) return;

		const fetchPatient = async () => {
			setLoading(true);
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

	if (loading || !patient) {
		return (
			<View style={styles.center}>
				<ActivityIndicator size="large" color={colors.primary} />
				<Text style={styles.loadingText}>Carregando paciente...</Text>
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
				{/* Foto + Nome + Idade */}
				<View style={styles.header}>
					<Avatar photoURL={patient.photoThumbnailURL} size={120} />
					<Text style={styles.name}>{patient.name}</Text>
					<Text style={styles.age}>
						{patient.birthDate
							? `${
									new Date().getFullYear() -
									new Date(patient.birthDate).getFullYear()
							  } anos`
							: "-"}
					</Text>
				</View>

				{/* Informações básicas */}
				<View style={styles.infoCard}>
					<Text style={styles.infoLabel}>Documento</Text>
					<Text style={styles.infoValue}>
						{patient.documentId || "-"}
					</Text>

					<Text style={styles.infoLabel}>Telefone</Text>
					<Text style={styles.infoValue}>{patient.phone || "-"}</Text>

					<Text style={styles.infoLabel}>Endereço</Text>
					<Text style={styles.infoValue}>
						{patient.address || "-"}
					</Text>

					<Text style={styles.infoLabel}>Observações</Text>
					<Text style={styles.infoValue}>{patient.notes || "-"}</Text>
				</View>

				<ButtonPrimary title="Editar" onPress={handleEdit} />
				<ButtonPrimary
					title="Nova Ficha de Cuidados"
					onPress={() => setCareSheetVisible(true)}
					style={{ marginBottom: 18 }}
				/>

				{/* Atendimentos */}
				<Text style={styles.sectionTitle}>Atendimentos</Text>
				{mockAppointments.map((a) => (
					<View key={a.id} style={styles.appointmentCard}>
						<Text style={styles.appointmentDate}>{a.date}</Text>
						<Text style={styles.appointmentProfessional}>
							{a.professional}
						</Text>
						<Text style={styles.appointmentNotes}>{a.notes}</Text>
					</View>
				))}

				{/* Modal da Ficha de Cuidados */}
				<CareSheetModal
					visible={careSheetVisible}
					onClose={() => setCareSheetVisible(false)}
					patient={patient}
				/>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	containerScroll: {
		paddingHorizontal: 16,
		paddingTop: 20,
		paddingBottom: 10,
	},
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	center: { flex: 1, justifyContent: "center", alignItems: "center" },
	loadingText: { marginTop: 12, fontSize: 16, color: colors.textSecondary },

	header: { alignItems: "center", marginBottom: 20 },
	name: {
		fontSize: 22,
		fontWeight: "600",
		color: colors.textPrimary,
		marginTop: 12,
	},
	age: { fontSize: 16, color: colors.textSecondary, marginTop: 4 },

	infoCard: {
		backgroundColor: colors.cardBackground,
		borderRadius: 16,
		padding: 16,
		marginBottom: 16,
	},
	infoLabel: { fontSize: 14, color: colors.textSecondary, marginTop: 8 },
	infoValue: { fontSize: 16, color: colors.textPrimary, marginTop: 2 },

	buttonRow: { flexDirection: "row", marginBottom: 20 },

	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: colors.textPrimary,
		marginBottom: 12,
	},

	appointmentCard: {
		backgroundColor: colors.cardBackground,
		borderRadius: 12,
		padding: 12,
		marginBottom: 10,
		borderWidth: 1,
		borderColor: colors.border,
		shadowColor: "#000",
		shadowOpacity: 0.05,
		shadowRadius: 4,
		shadowOffset: { width: 0, height: 2 },
		elevation: 2,
	},

	appointmentDate: { fontSize: 14, color: colors.textSecondary },
	appointmentProfessional: {
		fontSize: 16,
		fontWeight: "600",
		color: colors.textPrimary,
	},
	appointmentNotes: { fontSize: 14, color: colors.textPrimary, marginTop: 4 },
});
