import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	ActivityIndicator,
	Alert,
} from "react-native";
import {
	SafeAreaView,
	useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import colors from "@/src/theme/colors";
import { getAttendanceById } from "@/src/firebase/attendanceService";
import { getPatientById } from "@/src/firebase/patientService";
import BackHeader from "@/src/components/BackHeader";
import PatientHeader from "@/src/components/PatientHeader";
import PatientInfo from "@/src/components/PatientInfo";
import ButtonPrimary from "@/src/components/ButtonPrimary";
import { Attendance, Patient } from "@/src/types";

export default function AttendanceDetailsScreen() {
	const insets = useSafeAreaInsets();
	const router = useRouter();
	const { id } = useLocalSearchParams<{ id: string }>();

	const [attendance, setAttendance] = useState<Attendance | null>(null);
	const [patient, setPatient] = useState<Patient | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchAttendance = async () => {
		if (!id) return;
		setLoading(true);
		try {
			const attendanceData = await getAttendanceById(id);
			if (!attendanceData) {
				Alert.alert("Erro", "Atendimento não encontrado");
				router.back();
				return;
			}
			setAttendance(attendanceData);

			const patientData = await getPatientById(attendanceData.patientId);
			if (!patientData) {
				Alert.alert("Erro", "Paciente não encontrado");
				router.back();
				return;
			}
			setPatient(patientData);
		} catch (err) {
			console.error(err);
			Alert.alert("Erro", "Não foi possível carregar o atendimento");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAttendance();
	}, [id]);

	const handleEdit = () => {
		if (!attendance?.id) return;
		router.push({
			pathname: "/form/attendances",
			params: { id: attendance.id },
		});
	};

	if (loading || !attendance || !patient) {
		return (
			<View style={styles.center}>
				<ActivityIndicator size="large" color={colors.primary} />
				<Text style={styles.loadingText}>
					Carregando atendimento...
				</Text>
			</View>
		);
	}

	return (
		<SafeAreaView style={{ flex: 1, paddingBottom: -insets.bottom }}>
			<View style={styles.container}>
				<BackHeader
					title="Atendimento"
					onPress={() => router.push(`/attendances`)}
				/>

				<ScrollView contentContainerStyle={styles.containerScroll}>
					{/* Cabeçalho do paciente */}
					<PatientHeader patient={patient} />

					{/* Informações básicas do paciente */}
					<PatientInfo patient={patient} />

					{/* Detalhes do atendimento */}
					<View style={styles.sectionCard}>
						<Text style={styles.sectionTitle}>
							Detalhes do Atendimento
						</Text>

						{attendance.anamnese ? (
							<DetailsItem
								label="Anamnese"
								value={attendance.anamnese}
							/>
						) : null}
						{attendance.diagnostic ? (
							<DetailsItem
								label="Diagnóstico"
								value={attendance.diagnostic}
							/>
						) : null}
						{attendance.treatment ? (
							<DetailsItem
								label="Tratamento"
								value={attendance.treatment}
							/>
						) : null}
						{attendance.prescribedMedications ? (
							<DetailsItem
								label="Medicações"
								value={attendance.prescribedMedications}
							/>
						) : null}
						{attendance.notes ? (
							<DetailsItem
								label="Observações"
								value={attendance.notes}
							/>
						) : null}

						<ButtonPrimary
							title="Editar Atendimento"
							onPress={handleEdit}
							style={{ marginTop: 12 }}
						/>
					</View>
				</ScrollView>
			</View>
		</SafeAreaView>
	);
}

function DetailsItem({ label, value }: { label: string; value: string }) {
	return (
		<View style={{ marginBottom: 12 }}>
			<Text style={styles.detailLabel}>{label}</Text>
			<Text style={styles.detailText}>{value}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: colors.background },
	containerScroll: {
		paddingHorizontal: 16,
		paddingTop: 20,
		paddingBottom: 10,
	},
	center: { flex: 1, justifyContent: "center", alignItems: "center" },
	loadingText: { marginTop: 12, fontSize: 16, color: colors.textSecondary },
	sectionCard: {
		backgroundColor: colors.cardBackground,
		borderRadius: 16,
		padding: 16,
		marginBottom: 20,
		borderWidth: 1,
		borderColor: colors.border,
		shadowColor: "#000",
		shadowOpacity: 0.05,
		shadowRadius: 6,
		shadowOffset: { width: 0, height: 3 },
		elevation: 2,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: colors.textPrimary,
		marginBottom: 12,
	},
	detailLabel: { fontSize: 14, fontWeight: "600", color: colors.textPrimary },
	detailText: { fontSize: 15, color: colors.textSecondary, marginTop: 4 },
});
