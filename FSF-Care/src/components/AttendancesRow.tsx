import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import colors from "@/src/theme/colors";
import Avatar from "@/src/components/Avatar";
import { DocumentWithId } from "@/src/firebase/_firebaseSafe";
import { Attendance, Patient } from "@/src/types";
import { getPatientById } from "@/src/firebase/patientService";
import { format, isToday, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AttendancesRowProps {
	item: DocumentWithId<Attendance>;
	router: any;
}

export default function AttendancesRow({ item, router }: AttendancesRowProps) {
	const [patient, setPatient] = useState<Patient | null>(null);
	const patientCache = useRef<{ [id: string]: Patient }>({});

	// Buscar paciente se não estiver no cache
	useEffect(() => {
		async function fetchPatient() {
			if (!item.data.patientId) return;

			if (patientCache.current[item.data.patientId]) {
				setPatient(patientCache.current[item.data.patientId]);
			} else {
				const p = await getPatientById(item.data.patientId);
				if (p) {
					patientCache.current[item.data.patientId] = p;
					setPatient(p);
				}
			}
		}

		fetchPatient();
	}, [item.data.patientId]);

	// Formatar data
	const dateText = item.data.createdAt
		? isToday(item.data.createdAt)
			? "Hoje"
			: isYesterday(item.data.createdAt)
			? "Ontem"
			: format(item.data.createdAt, "dd/MM/yyyy", { locale: ptBR })
		: "";

	// Truncar textos longos
	const truncate = (text: string | undefined, max = 30) =>
		text && text.length > max ? text.slice(0, max) + "..." : text || "";

	return (
		<TouchableOpacity
			onPress={() => router.push(`/attendances/${item.id}`)}
			activeOpacity={0.7}
		>
			<View style={styles.item}>
				<Avatar
					photoURL={patient?.photoURL}
					size={60}
					borderWidth={1}
					borderColor={colors.border}
				/>
				<View style={styles.info}>
					<Text style={styles.name}>
						{patient ? patient.name : "Carregando..."}{" "}
						<Text style={styles.date}>{dateText}</Text>
					</Text>
					<Text style={styles.sub}>
						{truncate(item.data.diagnostic)} •{" "}
						{truncate(item.data.treatment)}
					</Text>
					<Text style={styles.sub}>
						{truncate(item.data.prescribedMedications, 40)}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	item: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.cardBackground,
		padding: 12,
		borderRadius: 12,
		marginBottom: 10,
		borderWidth: 1,
		borderColor: colors.border,
		shadowColor: "#000",
		shadowOpacity: 0.05,
		shadowRadius: 4,
		shadowOffset: { width: 0, height: 2 },
		elevation: 2,
	},
	info: { marginLeft: 12, flex: 1 },
	name: { fontWeight: "600", fontSize: 16, color: colors.textPrimary },
	date: { fontWeight: "400", fontSize: 12, color: colors.textSecondary },
	sub: { color: colors.textSecondary, fontSize: 14 },
});
