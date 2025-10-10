// src/screens/RegisterScreen.tsx
import React, { useState, useContext } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../src/firebase/config";
import { useRouter } from "expo-router";
import { AuthContext } from "../../src/context/AuthContext";
import { User } from "../../src/types";

export default function RegisterScreen() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();
	const { login } = useContext(AuthContext);

	const handleRegister = async () => {
		if (!email || !password) {
			Alert.alert("Erro", "Preencha e-mail e senha");
			return;
		}

		try {
			// Cria usuário no Firebase Auth
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const uid = userCredential.user.uid;

			const newUser: User = {
				uid,
				email,
				active: false, // só vai ativar após usar access code
			};
			await setDoc(doc(db, "users", uid), newUser);

			// Salva no AuthContext
			await login(newUser);

			router.push("/auth/access-code");
		} catch (error: any) {
			let message = error.message;
			if (error.code === "auth/email-already-in-use") {
				message = "Este e-mail já está em uso";
			} else if (error.code === "auth/invalid-email") {
				message = "E-mail inválido";
			} else if (error.code === "auth/weak-password") {
				message = "Senha muito fraca";
			}
			Alert.alert("Erro no registro", message);
		}
	};

	return (
		<View style={styles.container}>
			<TextInput
				style={styles.input}
				placeholder="E-mail"
				keyboardType="email-address"
				autoCapitalize="none"
				value={email}
				onChangeText={setEmail}
			/>
			<TextInput
				style={styles.input}
				placeholder="Senha"
				secureTextEntry
				value={password}
				onChangeText={setPassword}
			/>
			<Button title="Registrar" onPress={handleRegister} />
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
});
