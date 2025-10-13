// src/screens/AccessCodeScreen.tsx
import React, { useState, useContext } from "react";
import { View, TextInput, Button, Alert, StyleSheet, Text } from "react-native";
import { AuthContext } from "@/src/context/AuthContext";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import LogoutButton from "@/src/components/LogoutButton";
import GenerateAccessCode from "@/src/components/GenerateAccessCode";
import { useAccessCode } from "@/src/hooks/useAccessCode";

export default function AccessCodeScreen() {
	const [code, setCode] = useState("");
	const { user } = useContext(AuthContext);
	const { validateAccessCode, loading } = useAccessCode();
	const router = useRouter();

	if (!user) {
		return (
			<View style={styles.container}>
				<Text>Usuário não encontrado. Faça login novamente.</Text>
			</View>
		);
	}

	const handleValidate = async () => {
		const success = await validateAccessCode(code);
	};

	return (
		<SafeAreaView style={styles.container}>
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
				onPress={handleValidate}
				disabled={loading}
			/>
			<GenerateAccessCode />
			<LogoutButton />
		</SafeAreaView>
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
