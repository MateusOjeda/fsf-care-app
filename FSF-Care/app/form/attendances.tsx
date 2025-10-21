// src/screens/AttendanceForm.tsx
import React, { useState, useContext, useEffect } from "react";
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	Alert,
	ScrollView,
	TouchableOpacity,
	ActivityIndicator,
	TouchableWithoutFeedback,
	Keyboard,
	Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import colors from "@/src/theme/colors";
import ButtonPrimary from "@/src/components/ButtonPrimary";
import PatientSearchModal from "@/src/components/PatientSearchModal";
import { AuthContext } from "@/src/context/AuthContext";
import { Attendance, Patient } from "@/src/types";
import { DocumentWithId } from "@/src/firebase/_firebaseSafe";
import {
	createAttendance,
	updateAttendanceById,
	getAttendanceById,
} from "@/src/firebase/attendanceService";
import { Ionicons } from "@expo/vector-icons";
import PatientInfo from "@/src/components/PatientInfo";
import PatientHeader from "@/src/components/PatientHeader";
import BackHeader from "@/src/components/BackHeader";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function AttendanceForm() {
	const { user } = useContext(AuthContext);
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();

	// Modal de pacientes
	const [modalVisible, setModalVisible] = useState(false);

	// Form state
	const [selectedPatient, setSelectedPatient] =
		useState<DocumentWithId<Patient> | null>(null);
	const [anamnese, setAnamnese] = useState("");
	const [diagnostic, setDiagnostic] = useState("");
	const [treatment, setTreatment] = useState("");
	const [prescribedMedications, setPrescribedMedications] = useState("");
	const [notes, setNotes] = useState("");
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		if (!id) {
			setLoading(false);
			return;
		}

		const fetchAttendance = async () => {
			try {
				const data = await getAttendanceById(id);
				if (!data) {
					Alert.alert("Erro", "Atendimento não encontrado");
					router.back();
					return;
				}
				setSelectedPatient({ id: data.patientId, data: {} as Patient }); // Só id é necessário
				setAnamnese(data.anamnese || "");
				setDiagnostic(data.diagnostic || "");
				setTreatment(data.treatment || "");
				setPrescribedMedications(data.prescribedMedications || "");
				setNotes(data.notes || "");
			} catch (err) {
				console.error(err);
				Alert.alert("Erro", "Não foi possível carregar o atendimento");
			} finally {
				setLoading(false);
			}
		};

		fetchAttendance();
	}, [id]);

	const handleSave = async () => {
		if (!selectedPatient) {
			Alert.alert("Aviso", "Selecione um paciente.");
			return;
		}

		setSaving(true);
		try {
			const attendanceData: Attendance = {
				patientId: selectedPatient.id,
				userId: user?.uid!,
				anamnese,
				diagnostic,
				treatment,
				prescribedMedications,
				notes,
				createdAt: new Date(),
			};

			if (id) {
				await updateAttendanceById(id, attendanceData);
			} else {
				await createAttendance(attendanceData);
			}

			router.push("/attendances");
		} catch (err) {
			console.error(err);
			Alert.alert("Erro", "Não foi possível salvar o atendimento");
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
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
		<SafeAreaView style={styles.safeArea}>
			<BackHeader
				title={id ? "Editar Atendimento" : "Novo Atendimento"}
				// onPress={() =>
				//     router.replace(id ? `/patients/${id}` : `/patients`)
				// }
			/>

			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<KeyboardAwareScrollView
					contentContainerStyle={styles.container}
					enableOnAndroid={true}
					keyboardShouldPersistTaps="handled"
					extraScrollHeight={Platform.OS === "ios" ? 40 : 0}
					showsVerticalScrollIndicator={false}
				>
					<TouchableOpacity onPress={() => setModalVisible(true)}>
						{selectedPatient ? (
							<>
								<PatientHeader patient={selectedPatient.data} />
								<PatientInfo patient={selectedPatient.data} />
							</>
						) : (
							<View
								style={{
									justifyContent: "center",
									alignItems: "center",
									paddingVertical: 20,
								}}
							>
								<Ionicons
									name="add-circle-outline"
									size={70}
									color={colors.primary}
								/>
								<Text
									style={{
										color: colors.textSecondary,
										marginTop: 8,
									}}
								>
									Selecionar paciente
								</Text>
							</View>
						)}
					</TouchableOpacity>

					<Text style={styles.label}>Anamnese</Text>
					<TextInput
						style={[
							styles.input,
							{ height: 80, textAlignVertical: "top" },
						]}
						placeholder="Histórico, queixas, sintomas..."
						value={anamnese}
						onChangeText={setAnamnese}
						multiline
					/>

					<Text style={styles.label}>Diagnóstico</Text>
					<TextInput
						style={[
							styles.input,
							{ height: 60, textAlignVertical: "top" },
						]}
						placeholder="Diagnóstico realizado"
						value={diagnostic}
						onChangeText={setDiagnostic}
						multiline
					/>

					<Text style={styles.label}>Tratamento</Text>
					<TextInput
						style={[
							styles.input,
							{ height: 60, textAlignVertical: "top" },
						]}
						placeholder="Plano de tratamento"
						value={treatment}
						onChangeText={setTreatment}
						multiline
					/>

					<Text style={styles.label}>Remédios receitados</Text>
					<TextInput
						style={[
							styles.input,
							{ height: 60, textAlignVertical: "top" },
						]}
						placeholder="Medicamentos prescritos"
						value={prescribedMedications}
						onChangeText={setPrescribedMedications}
						multiline
					/>

					<Text style={styles.label}>Observações</Text>
					<TextInput
						style={[
							styles.input,
							{ height: 60, textAlignVertical: "top" },
						]}
						placeholder="Observações adicionais"
						value={notes}
						onChangeText={setNotes}
						multiline
					/>

					<ButtonPrimary
						title={saving ? "Salvando..." : "Salvar Atendimento"}
						onPress={handleSave}
						loading={saving}
					/>
				</KeyboardAwareScrollView>
			</TouchableWithoutFeedback>

			<PatientSearchModal
				visible={modalVisible}
				onSelect={(patient) => {
					setSelectedPatient(patient);
					setModalVisible(false);
				}}
				onClose={() => setModalVisible(false)}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: { flex: 1, backgroundColor: colors.background },
	container: { paddingHorizontal: 20, paddingBottom: 30 },
	center: { flex: 1, justifyContent: "center", alignItems: "center" },
	loadingText: { marginTop: 10, color: colors.textSecondary, fontSize: 14 },
	label: {
		fontSize: 14,
		fontWeight: "500",
		color: colors.textSecondary,
		marginBottom: 6,
	},
	input: {
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 10,
		padding: 12,
		backgroundColor: colors.white,
		color: colors.textPrimary,
		marginBottom: 14,
		fontSize: 15,
	},
});
