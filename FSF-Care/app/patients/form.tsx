import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	TextInput,
	Button,
	StyleSheet,
	Alert,
	Image,
	TouchableOpacity,
	ActivityIndicator,
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
} from "@/src/firebase/patientService";
import { uploadImageAsync } from "@/src/firebase/storageService";
import BackHeader from "@/src/components/BackHeader";

export default function PatientForm() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();

	const [patient, setPatient] = useState<Patient | null>(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	// Form states
	const [name, setName] = useState("");
	const [birthDate, setBirthDate] = useState("");
	const [documentId, setDocumentId] = useState("");
	const [phone, setPhone] = useState("");
	const [address, setAddress] = useState("");
	const [notes, setNotes] = useState("");
	const [photoURI, setPhotoURI] = useState<string | undefined>();

	// Carregar paciente se houver id
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
				setBirthDate(
					data.birthDate
						? new Date(data.birthDate).toISOString().split("T")[0]
						: ""
				);
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
		if (!patient) return;

		setSaving(true);
		try {
			let photoURL = patient.photoURL;
			let photoThumbnailURL = patient.photoThumbnailURL;

			if (
				photoURI &&
				photoURI.startsWith("file://") &&
				photoURI !== patient.photoURL
			) {
				// Upload da foto full-size
				const storagePath = `patients/${patient.id}.jpg`;
				photoURL = await uploadImageAsync(photoURI, storagePath);

				// Cria e upload da thumbnail
				const manipResult = await ImageManipulator.manipulateAsync(
					photoURI,
					[{ resize: { width: 150, height: 150 } }], // tamanho da thumbnail
					{ compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
				);

				const thumbPath = `patients/${patient.id}_thumb.jpg`;
				photoThumbnailURL = await uploadImageAsync(
					manipResult.uri,
					thumbPath
				);
			}

			await updatePatientById(patient.id!, {
				name,
				birthDate: birthDate ? new Date(birthDate) : undefined,
				documentId,
				phone,
				address,
				notes,
				photoURL,
				photoThumbnailURL,
			});

			Alert.alert("Sucesso", "Paciente atualizado!");
			router.back();
		} catch (err) {
			console.error(err);
			Alert.alert("Erro", "Não foi possível atualizar o paciente");
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<View style={styles.center}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<BackHeader
				title="Editar Paciente"
				onPress={() =>
					id !== undefined
						? router.replace(`/admin/patients/${id}`)
						: router.replace(`/admin/patients`)
				}
			/>

			<TouchableOpacity onPress={handlePickImage}>
				<Image
					source={
						photoURI
							? { uri: photoURI }
							: require("@/assets/images/default-profile.png")
					}
					style={styles.photo}
				/>
				<Text style={{ textAlign: "center", color: "#007bff" }}>
					Alterar foto
				</Text>
			</TouchableOpacity>

			<TextInput
				style={styles.input}
				placeholder="Nome"
				value={name}
				onChangeText={setName}
			/>
			<TextInput
				style={styles.input}
				placeholder="Data de nascimento (YYYY-MM-DD)"
				value={birthDate}
				onChangeText={setBirthDate}
			/>
			<TextInput
				style={styles.input}
				placeholder="Documento"
				value={documentId}
				onChangeText={setDocumentId}
			/>
			<TextInput
				style={styles.input}
				placeholder="Telefone"
				value={phone}
				onChangeText={setPhone}
			/>
			<TextInput
				style={styles.input}
				placeholder="Endereço"
				value={address}
				onChangeText={setAddress}
			/>
			<TextInput
				style={[styles.input, { height: 80 }]}
				placeholder="Observações"
				value={notes}
				onChangeText={setNotes}
				multiline
			/>

			<Button
				title={saving ? "Salvando..." : "Salvar"}
				onPress={handleSave}
				disabled={saving}
			/>
			{saving && (
				<ActivityIndicator size="large" style={{ marginTop: 10 }} />
			)}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	center: { flex: 1, justifyContent: "center", alignItems: "center" },
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		padding: 10,
		marginBottom: 15,
		borderRadius: 5,
	},
	photo: {
		width: 120,
		height: 120,
		borderRadius: 60,
		alignSelf: "center",
		marginBottom: 8,
		backgroundColor: "#eee",
	},
});
