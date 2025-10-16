import React, { useContext, useState } from "react";
import {
	ScrollView,
	View,
	Text,
	TextInput,
	StyleSheet,
	Alert,
	ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { AuthContext } from "@/src/context/AuthContext";
import { UserProfileIdType } from "@/src/types";
import {
	updateUserProfile,
	updateUser,
	getUserData,
} from "@/src/firebase/userService";
import { uploadImageAsync } from "@/src/firebase/storageService";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import BackHeader from "@/src/components/BackHeader";
import Avatar from "@/src/components/Avatar";
import { SafeAreaView } from "react-native-safe-area-context";
import ButtonPrimary from "@/src/components/ButtonPrimary";

const colors = {
	background: "#F6F4EE",
	textPrimary: "#2F3E46",
	textSecondary: "#52796F",
	primary: "#3D8361",
	border: "#D3D3D3",
	placeholder: "#7A7A7A",
	white: "#FFFFFF",
};

export default function ProfileScreen() {
	const { user, login } = useContext(AuthContext);
	const router = useRouter();

	const [name, setName] = useState(user?.profile?.name || "");
	const [birthDate, setBirthDate] = useState(
		user?.profile?.birthDate
			? new Date(user.profile.birthDate).toISOString().split("T")[0]
			: ""
	);
	const [documentIdType, setDocumentIdType] = useState<UserProfileIdType>(
		user?.profile?.documentIdType || "RG"
	);
	const [documentId, setDocumentId] = useState(
		user?.profile?.documentId || ""
	);
	const [crm, setCrm] = useState(user?.profile?.crm || "");
	const [photoURI, setPhotoURI] = useState<string | undefined>(
		user?.photoURL
	);
	const [loading, setLoading] = useState(false);

	// Selecionar imagem
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

	// Salvar perfil
	const handleSave = async () => {
		if (!user) return;

		setLoading(true);
		try {
			let photoURL = user.photoURL;
			let photoThumbnailURL = user.photoThumbnailURL;

			if (
				photoURI &&
				photoURI !== user.photoURL &&
				photoURI.startsWith("file://")
			) {
				const storagePath = `users/${user.uid}.jpg`;
				photoURL = await uploadImageAsync(photoURI, storagePath);

				const manipResult = await ImageManipulator.manipulateAsync(
					photoURI,
					[{ resize: { width: 150, height: 150 } }],
					{ compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
				);

				const thumbPath = `users/${user.uid}_thumb.jpg`;
				photoThumbnailURL = await uploadImageAsync(
					manipResult.uri,
					thumbPath
				);
			}

			await updateUser(user.uid, { photoURL, photoThumbnailURL });
			await updateUserProfile(user.uid, {
				name,
				birthDate: birthDate ? new Date(birthDate) : undefined,
				documentIdType: documentId !== "" ? documentIdType : undefined,
				documentId: documentId !== "" ? documentId : undefined,
				crm: crm ? crm : undefined,
			});

			const updatedUser = await getUserData(user.uid);
			if (!updatedUser) {
				Alert.alert("Erro", "Usuário não encontrado após atualização.");
				setLoading(false);
				return;
			}

			await login(updatedUser);
			Alert.alert("Sucesso", "Perfil atualizado!");
		} catch (err) {
			console.error(err);
			Alert.alert("Erro", "Não foi possível atualizar o perfil.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
			<BackHeader
				title="Editar Perfil"
				onPress={() => router.replace(`/admin/profile`)}
			/>

			<ScrollView
				contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
			>
				{/* Avatar */}
				<View style={{ alignItems: "center", marginBottom: 20 }}>
					<Avatar
						photoURL={photoURI}
						size={200}
						editable
						onPress={handlePickImage}
					/>
				</View>

				{/* Nome */}
				<Text style={styles.label}>Nome</Text>
				<TextInput
					style={styles.input}
					placeholder="Nome"
					value={name}
					onChangeText={setName}
				/>

				{/* Data de nascimento */}
				<Text style={styles.label}>Data de nascimento</Text>
				<TextInput
					style={styles.input}
					placeholder="YYYY-MM-DD"
					value={birthDate}
					onChangeText={setBirthDate}
				/>

				{/* Tipo de documento */}
				<Text style={styles.label}>Tipo de documento</Text>
				<View style={styles.pickerContainer}>
					<Picker
						selectedValue={documentIdType}
						onValueChange={(value) =>
							setDocumentIdType(value as UserProfileIdType)
						}
					>
						<Picker.Item label="RG" value="RG" />
						<Picker.Item label="CPF" value="CPF" />
						<Picker.Item label="Outro" value="Outro" />
					</Picker>
				</View>

				{/* Número do documento */}
				<Text style={styles.label}>Número do documento</Text>
				<TextInput
					style={styles.input}
					placeholder="Número do documento"
					value={documentId}
					onChangeText={setDocumentId}
				/>

				{/* CRM, se médico */}
				{user?.role === "medico" && (
					<>
						<Text style={styles.label}>CRM</Text>
						<TextInput
							style={styles.input}
							placeholder="CRM"
							value={crm}
							onChangeText={setCrm}
						/>
					</>
				)}

				<ButtonPrimary
					onPress={handleSave}
					loading={loading}
					title="Salvar"
				/>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	label: {
		color: colors.textSecondary,
		fontSize: 14,
		marginBottom: 4,
		marginTop: 12,
	},
	input: {
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 10,
		padding: 12,
		backgroundColor: colors.white,
		color: colors.textPrimary,
	},
	pickerContainer: {
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 10,
		backgroundColor: colors.white,
	},
	saveButton: {
		backgroundColor: colors.primary,
		paddingVertical: 14,
		borderRadius: 10,
		alignItems: "center",
		marginTop: 20,
	},
	saveButtonText: {
		color: colors.white,
		fontSize: 16,
		fontWeight: "600",
	},
	changePhotoText: {
		textAlign: "center",
		color: colors.primary,
		marginTop: 6,
		fontWeight: "500",
	},
});
