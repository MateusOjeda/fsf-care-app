import React, { useEffect, useState, useContext } from "react";
import {
	View,
	Text,
	FlatList,
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
import colors from "@/src/theme/colors";
import { AuthContext } from "@/src/context/AuthContext";
import { Attendance } from "@/src/types";
import { fetchAttendances } from "@/src/firebase/attendanceService";
import { DocumentWithId } from "@/src/firebase/_firebaseSafe";
import AttendancesRow from "@/src/components/AttendancesRow";

export default function AttendancesScreen() {
	const insets = useSafeAreaInsets();
	const { user } = useContext(AuthContext);
	const router = useRouter();

	const [attendances, setAttendances] = useState<
		DocumentWithId<Attendance>[]
	>([]);
	const [filtered, setFiltered] = useState<DocumentWithId<Attendance>[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");

	// Buscar atendimentos
	useEffect(() => {
		const fetch = async () => {
			setLoading(true);
			try {
				const data = await fetchAttendances();
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

	// Filtrar atendimentos pelo search
	useEffect(() => {
		if (!search.trim()) {
			setFiltered(attendances);
			return;
		}
		const lower = search.toLowerCase();
		const filteredList = attendances.filter(
			(a) =>
				a.data.diagnostic?.toLowerCase().includes(lower) ||
				a.data.treatment?.toLowerCase().includes(lower)
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
					style={styles.search}
					placeholder="Buscar diagnóstico ou tratamento..."
					value={search}
					onChangeText={setSearch}
					placeholderTextColor={colors.textSecondary}
				/>

				<FlatList
					data={filtered}
					keyExtractor={(item) => item.id!}
					renderItem={({ item }) => (
						<AttendancesRow item={item} router={router} />
					)}
					refreshing={loading}
					onRefresh={async () => {
						setLoading(true);
						const data = await fetchAttendances();
						setAttendances(data);
						setFiltered(data);
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
	center: { flex: 1, justifyContent: "center", alignItems: "center" },
	loadingText: {
		marginTop: 12,
		fontSize: 16,
		color: colors.textSecondary,
		fontWeight: "500",
		textAlign: "center",
	},
});
