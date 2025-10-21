import React from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Keyboard,
} from "react-native";
import ButtonPrimary from "@/src/components/ButtonPrimary";
import colors from "@/src/theme/colors";
import { Attendance } from "@/src/types";
import { DocumentWithId } from "@/src/firebase/_firebaseSafe";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface AttendancesListProps {
	attendances: DocumentWithId<Attendance>[];
	onNewAttendance: () => void;
}

export default function AttendancesList({
	attendances,
	onNewAttendance,
}: AttendancesListProps) {
	const router = useRouter();
	return (
		<View style={styles.sectionCard}>
			<Text style={styles.sectionTitle}>Atendimentos</Text>

			{attendances && attendances.length > 0 ? (
				attendances
					.sort(
						(a, b) =>
							b.data.createdAt!.getTime() -
							a.data.createdAt!.getTime()
					)
					.map((a) => (
						<TouchableOpacity
							key={a.id}
							style={styles.attendanceCard}
							onPress={() => router.push(`/attendances/${a.id}`)}
						>
							<Text style={styles.attendanceDate}>
								{a.data.createdAt!.toLocaleDateString()}
							</Text>
							{a.data.anamnese && (
								<Text style={styles.attendanceText}>
									<Text style={styles.attendanceLabel}>
										Anamnese:{" "}
									</Text>
									{a.data.anamnese}
								</Text>
							)}
							{a.data.diagnostic && (
								<Text style={styles.attendanceText}>
									<Text style={styles.attendanceLabel}>
										Diagnóstico:{" "}
									</Text>
									{a.data.diagnostic}
								</Text>
							)}
							{a.data.treatment && (
								<Text style={styles.attendanceText}>
									<Text style={styles.attendanceLabel}>
										Tratamento:{" "}
									</Text>
									{a.data.treatment}
								</Text>
							)}
							{a.data.prescribedMedications && (
								<Text style={styles.attendanceText}>
									<Text style={styles.attendanceLabel}>
										Remédios:{" "}
									</Text>
									{a.data.prescribedMedications}
								</Text>
							)}
							{a.data.notes && (
								<Text style={styles.attendanceText}>
									<Text style={styles.attendanceLabel}>
										Observações:{" "}
									</Text>
									{a.data.notes}
								</Text>
							)}
						</TouchableOpacity>
					))
			) : (
				<Text style={styles.emptyText}>
					Nenhum atendimento encontrado
				</Text>
			)}

			<ButtonPrimary
				title="Novo Atendimento"
				onPress={onNewAttendance}
				style={{ marginTop: 10 }}
			>
				<Ionicons name="document-text-outline" size={24} color="#fff" />
			</ButtonPrimary>
		</View>
	);
}

const styles = StyleSheet.create({
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
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: colors.textPrimary,
		marginBottom: 12,
	},
	emptyText: { color: colors.textSecondary, marginBottom: 12 },
	attendanceCard: {
		backgroundColor: colors.white,
		borderRadius: 10,
		padding: 12,
		marginBottom: 10,
		borderWidth: 1,
		borderColor: colors.border,
	},
	attendanceDate: {
		fontSize: 14,
		color: colors.textSecondary,
		marginBottom: 6,
	},
	attendanceLabel: { fontWeight: "600", color: colors.textPrimary },
	attendanceText: {
		fontSize: 14,
		color: colors.textPrimary,
		marginBottom: 4,
	},
});
