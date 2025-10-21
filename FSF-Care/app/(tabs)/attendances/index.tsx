import React, { useEffect, useState, useContext, useRef } from "react";
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	TextInput,
	ActivityIndicator,
	StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import {
	SafeAreaView,
	useSafeAreaInsets,
} from "react-native-safe-area-context";

import ButtonPrimary from "@/src/components/ButtonPrimary";
import Avatar from "@/src/components/Avatar";
import colors from "@/src/theme/colors";
import { AuthContext } from "@/src/context/AuthContext";
import { Attendance, Patient } from "@/src/types";
import { fetchAttendances } from "@/src/firebase/attendanceService";
import { getPatientById } from "@/src/firebase/patientService";

export default function AttendancesScreen() {
	const insets = useSafeAreaInsets();
	const { user } = useContext(AuthContext);
	const router = useRouter();

	const [attendances, setAttendances] = useState<Attendance[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [filtered, setFiltered] = useState<Attendance[]>([]);

	const searchInputRef = useRef<TextInput>(null);

	// Fetch attendances
	useEffect(() => {
		const fetch = async () => {
			setLoading(true);
			try {
				const data = await fetchAttendances(); // retorna array de Attendances
				setAttendances(data);
				setFiltered(data);
			} catch (err) {
				console.error("Erro ao buscar atendimentos:", err);
			} finally {
				setLoading(false);
			}
		};
		fetch();
	}, []);

	// Filtrar por search
	useEffect(() => {
		if (!search.trim()) {
			setFiltered(attendances);
			return;
		}

		const lower = search.toLowerCase();
		const filteredList = attendances.filter(
			(a) =>
				a.patientName?.toLowerCase().includes(lower) ||
				a.diagnostic?.toLowerCase().includes(lower)
		);
		setFiltered(filteredList);
	}, [search, attendances]);

	const handleAdd = () => router.push("/form/attendances");

	if (loading) {
		return (
			<View style={styles.center}>
				<ActivityIndicator size="large" color={colors.primary} />
				<Text style={styles.loadingText}>
					Carregando atendimentos...
				</Text>
			</View>
		);
	}

	return (
		<SafeAreaView style={{ flex: 1, paddingBottom: -insets.bottom }}>
			<View style={styles.container}>
				<Text style={styles.title}>Atendimentos</Text>

				<TextInput
					ref={searchInputRef}
					style={styles.search}
					placeholder="Buscar por paciente ou diagnóstico..."
					value={search}
					onChangeText={setSearch}
					placeholderTextColor={colors.textSecondary}
				/>

				<FlatList
					data={filtered}
					keyExtractor={(item) => item.id!}
					renderItem={({ item }) => (
						<TouchableOpacity
							onPress={() =>
								router.push(`/attendances/${item.id}`)
							}
							activeOpacity={0.7}
						>
							<View style={styles.item}>
								<Avatar
									photoURL={item.patientPhotoURL}
									size={60}
									borderWidth={1}
									borderColor={colors.border}
								/>
								<View style={styles.info}>
									<Text style={styles.name}>
										{item.patientName}
									</Text>
									<Text style={styles.sub}>
										{item.diagnostic || "-"} •{" "}
										{item.treatment || "-"}
									</Text>
									<Text style={styles.sub}>
										{item.prescribedMedications || ""}
									</Text>
								</View>
							</View>
						</TouchableOpacity>
					)}
					refreshing={loading}
					onRefresh={async () => {
						setLoading(true);
						const data = await fetchAttendances();
						setAttendances(data);
						setLoading(false);
					}}
				/>

				<ButtonPrimary title="Novo Atendimento" onPress={handleAdd} />
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
		paddingHorizontal: 16,
		paddingTop: 30,
		paddingBottom: 10,
	},
	title: {
		fontSize: 22,
		fontWeight: "600",
		color: colors.textPrimary,
		marginBottom: 12,
	},
	search: {
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 10,
		padding: 12,
		marginBottom: 12,
		backgroundColor: colors.white,
		color: colors.textPrimary,
	},
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
	sub: { color: colors.textSecondary, fontSize: 14 },
	center: { flex: 1, justifyContent: "center", alignItems: "center" },
	loadingText: {
		marginTop: 12,
		fontSize: 16,
		color: colors.textSecondary,
		fontWeight: "500",
		textAlign: "center",
	},
});
