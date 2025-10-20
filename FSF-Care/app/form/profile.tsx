import React, { useContext, useState } from "react";
import {
	Platform,
	View,
	Text,
	TextInput,
	StyleSheet,
	Alert,
	Keyboard,
	TouchableWithoutFeedback,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { AuthContext } from "@/src/context/AuthContext";
import { UserProfileIdType, GenderType } from "@/src/types";
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
import colors from "@/src/theme/colors";
import DateInput from "@/src/components/DateInput";
import { GENDER_LABELS } from "@/src/data/labels";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function ProfileScreen() {
	const { user, login } = useContext(AuthContext);
	const router = useRouter();

	const [name, setName] = useState(user?.profile?.name || "");
	const [birthDate, setBirthDate] = useState<Date | null>(
		user?.profile?.birthDate || null
	);
	const [documentIdType, setDocumentIdType] = useState<UserProfileIdType>(
		user?.profile?.documentIdType || "RG"
	);
	const [documentId, setDocumentId] = useState(
		user?.profile?.documentId || ""
	);
	const [gender, setGender] = useState<GenderType>(
		user?.profile?.gender || "other"
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
				birthDate: birthDate ? birthDate : undefined,
				documentIdType: documentId !== "" ? documentIdType : undefined,
				documentId: documentId !== "" ? documentId : undefined,
				crm: crm ? crm : undefined,
				gender: gender ? gender : undefined,
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
				onPress={() => router.replace(`/profile`)}
			/>

			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<KeyboardAwareScrollView
					contentContainerStyle={{
						flexGrow: 1,
						paddingHorizontal: 20,
					}}
					enableOnAndroid={true}
					keyboardShouldPersistTaps="handled"
					extraScrollHeight={Platform.OS === "ios" ? 20 : 0} // ajusta o empurrão do teclado
				>
					{/* Avatar */}
					<View style={{ alignItems: "center" }}>
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
					<DateInput
						value={birthDate}
						onChange={setBirthDate}
						placeholder="Data de nascimento"
						formatString="dd/MM/yyyy"
						maximumDate={new Date()}
					/>

					{/* Gênero */}
					<Text style={styles.label}>Gênero</Text>
					<View style={styles.pickerContainer}>
						<Picker
							selectedValue={gender}
							onValueChange={(value) =>
								setGender(value as GenderType)
							}
						>
							{Object.entries(GENDER_LABELS).map(
								([key, label]) => (
									<Picker.Item
										key={key}
										label={label}
										value={key}
									/>
								)
							)}
						</Picker>
					</View>

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

					{/* CRM */}
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
						style={{ marginTop: 30 }}
					/>
				</KeyboardAwareScrollView>
			</TouchableWithoutFeedback>
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
		fontSize: 16,
	},
	pickerContainer: {
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 10,
		backgroundColor: colors.white,
	},
});
