// src/screens/GenerateAccessCodeScreen.tsx
import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useAccessCode } from "@/src/hooks/useAccessCode";
import { UserRole } from "@/src/types";

export default function GenerateAccessCodeScreen() {
	const [role, setRole] = useState<UserRole>("geral");
	const [maxUses, setMaxUses] = useState(1);
	const [codeExpiresAt, setCodeExpiresAt] = useState<number | undefined>(1);
	const [durationDays, setDurationDays] = useState<number | undefined>(
		undefined
	);

	const { generateAccessCode, loading } = useAccessCode();

	const handleRoleChange = (value: string) => {
		if (["geral", "psicossocial", "medico", "admin"].includes(value)) {
			setRole(value as UserRole);
		}
	};

	const handleGenerateCode = () => {
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + (codeExpiresAt ?? 0));

		generateAccessCode({
			role,
			maxUses,
			expiresAt,
			durationDays,
			usedBy: [],
		});

		// Limpar inputs
		setRole("geral");
		setMaxUses(1);
		setCodeExpiresAt(1);
		setDurationDays(undefined);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.label}>Role do usuário:</Text>
			<Picker
				selectedValue={role}
				onValueChange={handleRoleChange}
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
				Data de expiração do código em dias (1, 5, 7, por exemplo):
			</Text>
			<TextInput
				style={styles.input}
				keyboardType="number-pad"
				value={codeExpiresAt?.toString() ?? ""}
				onChangeText={(text) => {
					const value = parseInt(text, 10);
					setCodeExpiresAt(isNaN(value) ? undefined : value);
				}}
			/>

			<Text style={styles.label}>
				Validade do usuário em dias (30, 90 por exemplo) (opcional):
			</Text>
			<TextInput
				style={styles.input}
				keyboardType="number-pad"
				placeholder="indefinido"
				value={durationDays?.toString() ?? ""}
				onChangeText={(text) => {
					const value = parseInt(text, 10);
					setDurationDays(isNaN(value) ? undefined : value);
				}}
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
