// src/screens/AccessCodeScreen.tsx
import React, { useState, useContext } from "react";
import { View, TextInput, Button, Alert, StyleSheet, Text } from "react-native";
import {
	collection,
	query,
	where,
	getDocs,
	updateDoc,
	doc,
	Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { AuthContext } from "../../context/AuthContext";
import { useRouter } from "expo-router";
import { User, AccessCode } from "../../types";

import LogoutButton from "~components/LogoutButton";
import GenerateAccessCode from "~components/GenerateAccessCode";

export default function AccessCodeScreen() {
	const [code, setCode] = useState("");
	const [loading, setLoading] = useState(false);
	const { user, login } = useContext(AuthContext);
	const router = useRouter();

	if (!user) {
		return (
			<View style={styles.container}>
				<Text>Usuário não encontrado. Faça login novamente.</Text>
			</View>
		);
	}

	const handleValidateCode = async () => {
		if (!code) {
			Alert.alert("Erro", "Digite o código de acesso");
			return;
		}

		setLoading(true);

		try {
			// Busca o access code no Firestore
			const q = query(
				collection(db, "accessCodes"),
				where("code", "==", code)
			);
			const snapshot = await getDocs(q);

			if (snapshot.empty) {
				throw new Error("Código inválido");
			}

			const accessDoc = snapshot.docs[0];
			const accessData = accessDoc.data();

			// Valida data de expiração
			if (
				accessData.expiresAt &&
				accessData.expiresAt.toDate() < new Date()
			) {
				throw new Error("Este código expirou");
			}

			// Valida maxUses
			if (
				accessData.maxUses &&
				accessData.usedBy.length >= accessData.maxUses
			) {
				throw new Error("Código atingiu o limite de usos");
			}

			// Valida se já foi usado pelo usuário
			if (accessData.usedBy.includes(user.uid)) {
				throw new Error("Você já usou este código");
			}

			// Calculate expire date
			const userExpireAt = new Date();
			userExpireAt.setDate(
				userExpireAt.getDate() + accessData.durationDays
			);

			// Atualiza o usuário no Firestore
			const userRef = doc(db, "users", user.uid);
			const updatedUser: User = {
				...user,
				expiresAt: userExpireAt ? userExpireAt : undefined,
				role: accessData.role,
				active: true,
			};
			await updateDoc(userRef, {
				...updatedUser,
				expiresAt: updatedUser.expiresAt
					? Timestamp.fromDate(updatedUser.expiresAt)
					: undefined,
			});

			// Atualiza o array usedBy no access code
			await updateDoc(accessDoc.ref, {
				usedBy: [...accessData.usedBy, user.uid],
			});

			// Atualiza o contexto
			await login(updatedUser);
		} catch (error: any) {
			console.log("Erro validando access code:", error);
			Alert.alert("Erro", error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.label}>Digite seu código de acesso</Text>
			<TextInput
				style={styles.input}
				placeholder="Código"
				value={code}
				onChangeText={setCode}
				autoCapitalize="characters"
			/>
			<Button
				title={loading ? "Validando..." : "Validar"}
				onPress={handleValidateCode}
				disabled={loading}
			/>
			<GenerateAccessCode />
			<LogoutButton />
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, justifyContent: "center", padding: 20 },
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		padding: 10,
		marginBottom: 15,
		borderRadius: 5,
	},
	label: { fontSize: 16, marginBottom: 10 },
});
