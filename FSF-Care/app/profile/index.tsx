import React, { useContext, useState } from "react";
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
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";

import { AuthContext } from "@/src/context/AuthContext";
import { UserProfileIdType, Patient } from "@/src/types";
import {
	updateUserProfile,
	updateUser,
	getUserData,
} from "@/src/firebase/userService";
import { uploadImageAsync } from "@/src/firebase/storageService";

export default function ProfileScreen() {
	const { user, login } = useContext(AuthContext);

	// Estados do form
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

	// Estado da imagem
	const [photoURI, setPhotoURI] = useState<string | undefined>(
		user?.photoURL
	);

	const [loading, setLoading] = useState(false);

	// Escolher imagem localmente
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

	// Salvar alterações (incluindo upload da foto se houver)
	const handleSave = async () => {
		if (!user) return;

		setLoading(true);
		try {
			let photoURL: string | undefined = user.photoURL;

			// Se usuário selecionou nova foto, faz upload para Firebase Storage
			if (photoURI && photoURI !== user.photoURL) {
				const storagePath = `users/${user.uid}.jpg`;
				photoURL = await uploadImageAsync(photoURI, storagePath);
			}

			// Atualiza user
			await updateUser(user.uid, { photoURL });

			// Atualiza profile
			await updateUserProfile(user.uid, {
				name,
				birthDate: birthDate ? new Date(birthDate) : undefined,
				documentIdType,
				documentId,
				crm,
			});

			// Busca user atualizado e atualiza contexto
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
		<View style={styles.container}>
			<Text style={styles.title}>Seu Perfil</Text>
			<Text>E-mail: {user?.email}</Text>
			<Text>Função: {user?.role ?? "Não definido"}</Text>

			{/* Foto */}
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

			{/* Campos de formulário */}
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

			<Text>Tipo de documento:</Text>
			<Picker
				selectedValue={documentIdType}
				onValueChange={(value) =>
					setDocumentIdType(value as UserProfileIdType)
				}
				style={styles.picker}
			>
				<Picker.Item label="RG" value="RG" />
				<Picker.Item label="CPF" value="CPF" />
				<Picker.Item label="Outro" value="Outro" />
			</Picker>

			<TextInput
				style={styles.input}
				placeholder="Número do documento"
				value={documentId}
				onChangeText={setDocumentId}
			/>

			{user && user.role === "medico" && (
				<TextInput
					style={styles.input}
					placeholder="CRM"
					value={crm}
					onChangeText={setCrm}
				/>
			)}

			<Text>{loading}</Text>

			<Button
				title={loading ? "Salvando..." : "Salvar"}
				onPress={handleSave}
				disabled={loading}
			/>

			{loading && (
				<ActivityIndicator size="large" style={{ marginTop: 10 }} />
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 20, justifyContent: "center" },
	title: { fontSize: 20, marginBottom: 10 },
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		padding: 10,
		marginBottom: 15,
		borderRadius: 5,
	},
	picker: {
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 5,
		marginBottom: 15,
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
