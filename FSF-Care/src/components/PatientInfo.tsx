import React from "react";
import { View, StyleSheet, Text } from "react-native";
import colors from "@/src/theme/colors";
import ButtonPrimary from "@/src/components/ButtonPrimary";
import { Ionicons } from "@expo/vector-icons";
import { Patient } from "../types";
import { GENDER_LABELS } from "../data/labels";

type PatientInfoProps = {
	patient: Patient;
	handleEdit?: () => void;
};

export default function PatientInfo({ patient, handleEdit }: PatientInfoProps) {
	return (
		<View style={styles.sectionCard}>
			{patient.birthDate && (
				<>
					<Text style={styles.infoLabel}>Data de nascimento</Text>
					<Text style={styles.infoValue}>
						{patient.birthDate.toLocaleDateString("pt-BR")}
					</Text>
				</>
			)}

			{patient.gender && (
				<>
					<Text style={styles.infoLabel}>Gênero</Text>
					<Text style={styles.infoValue}>
						{GENDER_LABELS[patient.gender]}
					</Text>
				</>
			)}

			{patient.documentId && (
				<>
					<Text style={styles.infoLabel}>Documento</Text>
					<Text style={styles.infoValue}>{patient.documentId}</Text>
				</>
			)}

			{patient.phone && (
				<>
					<Text style={styles.infoLabel}>Telefone</Text>
					<Text style={styles.infoValue}>{patient.phone}</Text>
				</>
			)}

			{patient.address && (
				<>
					<Text style={styles.infoLabel}>Endereço</Text>
					<Text style={styles.infoValue}>{patient.address}</Text>
				</>
			)}

			{patient.notes && (
				<>
					<Text style={styles.infoLabel}>Observações</Text>
					<Text style={styles.infoValue}>{patient.notes}</Text>
				</>
			)}

			{handleEdit && (
				<ButtonPrimary
					title="Editar"
					onPress={handleEdit}
					style={{ marginTop: 10 }}
				>
					<Ionicons
						name="pencil-outline"
						size={20}
						color={colors.white}
					/>
				</ButtonPrimary>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	infoLabel: { fontSize: 14, color: colors.textSecondary, marginTop: 8 },
	infoValue: { fontSize: 16, color: colors.textPrimary, marginTop: 2 },
	sectionCard: {
		backgroundColor: colors.cardBackground,
		borderRadius: 16,
		padding: 16,
		marginBottom: 20,
		borderWidth: 1,
		borderColor: colors.border,
		shadowColor: "#000",
		shadowOpacity: 0.05,
		shadowRadius: 6,
		shadowOffset: { width: 0, height: 3 },
		elevation: 2,
	},
});
