import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "~firebase/config";
import { AccessCode } from "~types";

export default function GenerateAccessCodeScreen() {
	const [role, setRole] = useState<AccessCode["role"]>("geral");
	const [maxUses, setMaxUses] = useState<number>(1);
	const [expiresAt, setExpiresAt] = useState<string>(""); // formato YYYY-MM-DD
	const [loading, setLoading] = useState(false);
	const [durationDays, setDurationDays] = useState<number>(30);

	const generateRandomCode = () => {
		const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		let code = "";
		for (let i = 0; i < 6; i++) {
			code += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return code;
	};

	const handleGenerateCode = async () => {
		if (maxUses <= 0) {
			Alert.alert("Erro", "O número máximo de usos deve ser maior que 0");
			return;
		}

		setLoading(true);

		try {
			const code = generateRandomCode();

			// Data padrão +2 dias
			const defaultDate = new Date();
			defaultDate.setDate(defaultDate.getDate() + 1);

			const newAccessCode: AccessCode = {
				code,
				role,
				usedBy: [],
				maxUses,
				expiresAt: expiresAt ? new Date(expiresAt) : defaultDate,
				durationDays: durationDays || undefined,
			};

			await addDoc(collection(db, "accessCodes"), {
				...newAccessCode,
				expiresAt: Timestamp.fromDate(newAccessCode.expiresAt),
			});

			Alert.alert("Sucesso", `Código gerado: ${code}`);

			// Limpar inputs
			setRole("geral");
			setMaxUses(1);
			setExpiresAt("");
		} catch (error: any) {
			console.log("Erro gerando access code:", error);
			Alert.alert("Erro", error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.label}>Role do usuário:</Text>
			<Picker
				selectedValue={role}
				onValueChange={(value) => setRole(value)}
				style={styles.picker}
			>
				<Picker.Item label="Geral" value="geral" />
				<Picker.Item label="Psicossocial" value="psicossocial" />
				<Picker.Item label="Médico" value="medico" />
				<Picker.Item label="Admin" value="admin" />
			</Picker>

			<Text style={styles.label}>Número máximo de usos:</Text>
			<TextInput
				style={styles.input}
				keyboardType="number-pad"
				value={maxUses.toString()}
				onChangeText={(text) => setMaxUses(Number(text))}
			/>

			<Text style={styles.label}>
				Data de expiração (YYYY-MM-DD, opcional):
			</Text>
			<TextInput
				style={styles.input}
				placeholder="2025-12-31"
				value={expiresAt}
				onChangeText={setExpiresAt}
			/>

			<Text style={styles.label}>
				Validade do usuário em dias (opcional):
			</Text>
			<TextInput
				style={styles.input}
				keyboardType="number-pad"
				placeholder="30"
				value={durationDays?.toString() ?? ""}
				onChangeText={(text) => setDurationDays(Number(text))}
			/>

			<Button
				title={loading ? "Gerando..." : "Gerar Código"}
				onPress={handleGenerateCode}
				disabled={loading}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 20 },
	label: { marginTop: 15, marginBottom: 5 },
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		padding: 10,
		borderRadius: 5,
	},
	picker: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5 },
});
