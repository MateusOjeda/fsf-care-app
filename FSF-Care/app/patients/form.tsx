import React, { useEffect, useState, useContext } from "react";
import {
	View,
	Text,
	TextInput,
	ScrollView,
	ActivityIndicator,
	StyleSheet,
	Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { Patient } from "@/src/types";
import {
	getPatientById,
	updatePatientById,
	createPatient,
} from "@/src/firebase/patientService";
import { uploadImageAsync } from "@/src/firebase/storageService";
import BackHeader from "@/src/components/BackHeader";
import Avatar from "@/src/components/Avatar";
import ButtonPrimary from "@/src/components/ButtonPrimary";
import colors from "@/src/theme/colors";
import DateInput from "@/src/components/DateInput";
import { AuthContext } from "@/src/context/AuthContext";

export default function PatientForm() {
	const { user } = useContext(AuthContext);
	const createdBy = user?.uid;
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();

	const [patient, setPatient] = useState<Patient | null>(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	// Form states
	const [name, setName] = useState("");
	const [birthDate, setBirthDate] = useState<Date | null>(null);
	const [documentId, setDocumentId] = useState("");
	const [phone, setPhone] = useState("");
	const [address, setAddress] = useState("");
	const [notes, setNotes] = useState("");
	const [photoURI, setPhotoURI] = useState<string | undefined>();

	useEffect(() => {
		if (!id) {
			setLoading(false);
			return;
		}

		const fetchPatient = async () => {
			try {
				const data = await getPatientById(id);
				if (!data) {
					Alert.alert("Erro", "Paciente não encontrado");
					router.back();
					return;
				}
				setPatient(data);
				setName(data.name);
				setBirthDate(data.birthDate ? new Date(data.birthDate) : null);
				setDocumentId(data.documentId || "");
				setPhone(data.phone || "");
				setAddress(data.address || "");
				setNotes(data.notes || "");
				setPhotoURI(data.photoURL);
			} catch (err) {
				console.error(err);
				Alert.alert("Erro", "Não foi possível carregar o paciente");
			} finally {
				setLoading(false);
			}
		};

		fetchPatient();
	}, [id]);

	const handlePickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: "images",
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.7,
		});

		if (!result.canceled && result.assets.length > 0) {
			setPhotoURI(result.assets[0].uri);
		}
	};

	const handleSave = async () => {
		if (!name.trim()) {
			Alert.alert("Aviso", "O nome é obrigatório.");
			return;
		}

		setSaving(true);
		try {
			let photoURL = patient?.photoURL;
			let photoThumbnailURL = patient?.photoThumbnailURL;

			// Upload de imagem (caso tenha selecionado)
			if (photoURI && photoURI.startsWith("file://")) {
				const patientId = patient?.id || Date.now().toString();
				const storagePath = `patients/${patientId}.jpg`;
				photoURL = await uploadImageAsync(photoURI, storagePath);

				const manipResult = await ImageManipulator.manipulateAsync(
					photoURI,
					[{ resize: { width: 150, height: 150 } }],
					{ compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
				);

				photoThumbnailURL = await uploadImageAsync(
					manipResult.uri,
					`patients/${patientId}_thumb.jpg`
				);
			}

			if (id && patient) {
				// Atualiza paciente existente
				await updatePatientById(patient.id!, {
					name,
					birthDate: birthDate ?? undefined,
					documentId,
					phone,
					address,
					notes,
					photoURL,
					photoThumbnailURL,
				});
				// Alert.alert("Sucesso", "Paciente atualizado!");
			} else {
				// Cria novo paciente
				await createPatient({
					name,
					birthDate: birthDate ?? undefined,
					documentId,
					phone,
					address,
					notes,
					photoURL,
					photoThumbnailURL,
					createdBy: patient?.createdBy || createdBy,
					createdAt: new Date(),
				});
				Alert.alert("Sucesso", "Paciente criado!");
			}

			router.replace("/admin/patients");
		} catch (err) {
			console.error(err);
			Alert.alert("Erro", "Não foi possível salvar o paciente");
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<View style={styles.center}>
				<ActivityIndicator size="large" color={colors.primary} />
				<Text style={styles.loadingText}>Carregando paciente...</Text>
			</View>
		);
	}

	return (
		<SafeAreaView style={styles.safeArea}>
			<BackHeader
				title={id ? "Editar Paciente" : "Novo Paciente"}
				onPress={() =>
					router.replace(
						id ? `/admin/patients/${id}` : `/admin/patients`
					)
				}
			/>

			<ScrollView
				contentContainerStyle={styles.container}
				showsVerticalScrollIndicator={false}
			>
				<Avatar
					photoURL={photoURI}
					size={120}
					editable
					onPress={handlePickImage}
				/>

				<View style={styles.formCard}>
					<TextInput
						style={styles.input}
						placeholder="Nome"
						value={name}
						onChangeText={setName}
						placeholderTextColor={colors.textSecondary}
					/>
					<DateInput
						value={birthDate}
						onChange={setBirthDate}
						placeholder="Data de nascimento"
						formatString="dd/MM/yyyy"
						maximumDate={new Date()}
						style={styles.input}
					/>
					<TextInput
						style={styles.input}
						placeholder="Documento"
						value={documentId}
						onChangeText={setDocumentId}
						placeholderTextColor={colors.textSecondary}
					/>
					<TextInput
						style={styles.input}
						placeholder="Telefone"
						value={phone}
						onChangeText={setPhone}
						placeholderTextColor={colors.textSecondary}
					/>
					<TextInput
						style={styles.input}
						placeholder="Endereço"
						value={address}
						onChangeText={setAddress}
						placeholderTextColor={colors.textSecondary}
					/>
					<TextInput
						style={[
							styles.input,
							{ height: 90, textAlignVertical: "top" },
						]}
						placeholder="Observações"
						value={notes}
						onChangeText={setNotes}
						placeholderTextColor={colors.textSecondary}
						multiline
					/>
				</View>

				<ButtonPrimary
					onPress={handleSave}
					loading={saving}
					title={saving ? "Salvando..." : "Salvar"}
				/>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: { flex: 1, backgroundColor: colors.background },
	container: {
		padding: 20,
		alignItems: "center",
	},
	center: { flex: 1, justifyContent: "center", alignItems: "center" },
	loadingText: {
		marginTop: 10,
		color: colors.textSecondary,
		fontSize: 14,
	},
	formCard: {
		width: "100%",
		backgroundColor: colors.cardBackground,
		borderRadius: 16,
		padding: 20,
		marginTop: 10,
		marginBottom: 20,
		shadowColor: colors.shadow,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 6,
		elevation: 3,
	},
	input: {
		width: "100%",
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 10,
		padding: 12,
		marginBottom: 14,
		backgroundColor: colors.white,
		color: colors.textPrimary,
		fontSize: 15,
	},
	saveButton: {
		backgroundColor: colors.primary,
		paddingVertical: 15,
		paddingHorizontal: 40,
		borderRadius: 12,
		shadowColor: colors.shadow,
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 3,
	},
	saveButtonText: {
		color: colors.white,
		fontWeight: "600",
		fontSize: 16,
		textAlign: "center",
	},
});
