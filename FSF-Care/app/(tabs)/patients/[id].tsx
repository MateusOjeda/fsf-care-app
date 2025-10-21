import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	Alert,
	ActivityIndicator,
	TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getPatientById } from "@/src/firebase/patientService";
import { Attendance, Patient } from "@/src/types";
import BackHeader from "@/src/components/BackHeader";
import ButtonPrimary from "@/src/components/ButtonPrimary";
import PatientInfo from "@/src/components/PatientInfo";
import colors from "@/src/theme/colors";
import CareSheetModal from "@/src/components/CareSheetModal";
import { Ionicons } from "@expo/vector-icons";
import PatientHeader from "@/src/components/PatientHeader";
import AttendancesList from "@/src/components/AttendancesList";
import { fetchAttendancesByPatientId } from "@/src/firebase/attendanceService";
import { DocumentWithId } from "@/src/firebase/_firebaseSafe";

export default function PatientsDetailsScreen() {
	const insets = useSafeAreaInsets();

	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const [patient, setPatient] = useState<Patient | null>(null);
	const [loading, setLoading] = useState(true);
	const [careSheetVisible, setCareSheetVisible] = useState(false);
	const [attendances, setAttendances] = useState<
		DocumentWithId<Attendance>[]
	>([]);
	const [loadingAttendances, setLoadingAttendances] = useState(true);

	const fetchPatientAttendances = async () => {
		if (!patient?.id) return;
		setLoadingAttendances(true);
		try {
			const docs = await fetchAttendancesByPatientId(patient.id);
			setAttendances(docs);
		} catch (err) {
			console.error(err);
			Alert.alert("Erro", "Não foi possível carregar os atendimentos");
		} finally {
			setLoadingAttendances(false);
		}
	};

	useEffect(() => {
		if (patient?.id) {
			fetchPatientAttendances();
		}
	}, [patient]);

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

	useEffect(() => {
		if (!id) return;
		fetchPatient();
	}, [id]);

	const handleEdit = () => {
		if (!id) return;
		router.push({ pathname: "/form/patients", params: { id } });
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
		<SafeAreaView style={{ flex: 1, paddingBottom: -insets.bottom }}>
			<View style={styles.container}>
				<BackHeader
					title="Perfil do Paciente"
					onPress={() => router.replace(`/patients`)}
				/>
				<ScrollView contentContainerStyle={styles.containerScroll}>
					{/* Cabeçalho */}
					<PatientHeader patient={patient} />

					{/* Informações básicas */}
					<PatientInfo patient={patient} handleEdit={handleEdit} />

					{/* CARD: Fichas de Cuidados */}
					<View style={styles.sectionCard}>
						<Text style={styles.sectionTitle}>
							Fichas de Cuidados
						</Text>
						{patient.careSheetSummaries &&
						patient.careSheetSummaries.length > 0 ? (
							patient.careSheetSummaries
								.sort(
									(a, b) =>
										new Date(b.createdAt).getTime() -
										new Date(a.createdAt).getTime()
								)
								.map((cs) => (
									<TouchableOpacity
										key={cs.id}
										style={styles.careSheetCard}
										onPress={() =>
											router.push({
												pathname:
													"/patients/careSheet/[id]",
												params: {
													id: cs.id,
													patientId: patient.id,
												},
											})
										}
									>
										<Text style={styles.careSheetDate}>
											{new Date(
												cs.createdAt
											).toLocaleDateString()}
										</Text>
										<Text style={styles.careSheetVersion}>
											Versão: {cs.version}
										</Text>
									</TouchableOpacity>
								))
						) : (
							<Text style={styles.emptyText}>
								Nenhuma ficha de cuidados encontrada
							</Text>
						)}
						<ButtonPrimary
							title="Nova Ficha de Cuidados"
							onPress={() => setCareSheetVisible(true)}
							style={{ marginTop: 10 }}
						>
							<Ionicons
								name="clipboard-outline"
								size={24}
								color="#fff"
							/>
						</ButtonPrimary>
					</View>

					{/* CARD: Atendimentos */}
					<AttendancesList
						attendances={attendances}
						onNewAttendance={() =>
							router.push(
								`/form/attendances?patientId=${patient.id}`
							)
						}
					/>

					{/* Modal de ficha */}
					<CareSheetModal
						visible={careSheetVisible}
						onClose={() => setCareSheetVisible(false)}
						patient={patient}
						onRefresh={fetchPatient}
					/>
				</ScrollView>
			</View>
		</SafeAreaView>
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
	emptyText: { color: colors.textSecondary, marginBottom: 12 },
	careSheetCard: {
		backgroundColor: colors.white,
		borderRadius: 10,
		padding: 12,
		marginBottom: 10,
		borderWidth: 1,
		borderColor: colors.border,
	},
	careSheetDate: { fontSize: 14, color: colors.textSecondary },
	careSheetVersion: {
		fontSize: 16,
		fontWeight: "600",
		color: colors.textPrimary,
	},
	appointmentCard: {
		backgroundColor: colors.white,
		borderRadius: 10,
		padding: 12,
		marginBottom: 10,
		borderWidth: 1,
		borderColor: colors.border,
	},
	appointmentDate: { fontSize: 14, color: colors.textSecondary },
	appointmentProfessional: {
		fontSize: 16,
		fontWeight: "600",
		color: colors.textPrimary,
	},
	appointmentNotes: { fontSize: 14, color: colors.textPrimary, marginTop: 4 },
});
