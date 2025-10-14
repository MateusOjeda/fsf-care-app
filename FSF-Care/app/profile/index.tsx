import React, { useContext, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { AuthContext } from "@/src/context/AuthContext";
import { updateUserProfile } from "@/src/firebase/userService";
import { UserProfileIdType } from "@/src/types";
import { Picker } from "@react-native-picker/picker";

export default function ProfileScreen() {
	const { user, setUser } = useContext(AuthContext);

	const [name, setName] = useState(user?.profile?.name || "");
	const [birthDate, setBirthDate] = useState(
		user?.profile?.birthDate?.toISOString().split("T")[0] || ""
	);
	const [documentIdType, setDocumentIdType] = useState<UserProfileIdType>(
		user?.profile?.documentIdType || "RG"
	);
	const [documentId, setDocumentId] = useState(
		user?.profile?.documentId || ""
	);
	const [crm, setCrm] = useState(user?.profile?.crm || "");

	const handleSave = async () => {
		if (!user) return;

		try {
			const updatedUser = await updateUserProfile(user.uid, {
				name,
				birthDate: birthDate ? new Date(birthDate) : undefined,
				documentIdType,
				documentId,
				crm,
			});
			setUser(updatedUser);
			Alert.alert("Sucesso", "Perfil atualizado!");
		} catch (err) {
			Alert.alert("Erro", "Não foi possível atualizar o perfil.");
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Seu Perfil</Text>
			<Text>E-mail: {user?.email}</Text>
			<Text>Função: {user?.role ?? "Não definido"}</Text>

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

			<Button title="Salvar" onPress={handleSave} />
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
});
