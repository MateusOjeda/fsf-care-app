import React, { useContext, useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	FlatList,
	Linking,
	ActivityIndicator,
} from "react-native";
import {
	SafeAreaView,
	useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import colors from "@/src/theme/colors";
import { AuthContext } from "@/src/context/AuthContext";
import { fetchAttendances } from "@/src/firebase/attendanceService";
import { DocumentWithId } from "@/src/firebase/_firebaseSafe";
import { Attendance } from "@/src/types";
import AttendancesRow from "@/src/components/AttendancesRow";
import { limit } from "firebase/firestore";

export default function HomeScreen() {
	const { user } = useContext(AuthContext);
	const router = useRouter();
	const insets = useSafeAreaInsets();

	const [recentAppointments, setRecentAppointments] = useState<
		DocumentWithId<Attendance>[]
	>([]);
	const [loading, setLoading] = useState(true);

	const fetchRecentAppointments = async () => {
		setLoading(true);
		try {
			const data = await fetchAttendances([limit(5)]);
			setRecentAppointments(data);
		} catch (err) {
			console.error("Erro ao buscar atendimentos recentes:", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchRecentAppointments();
	}, []);

	const todayText = format(new Date(), "dd 'de' MMMM 'de' yyyy", {
		locale: ptBR,
	});

	return (
		<SafeAreaView style={{ flex: 1, paddingBottom: -insets.bottom }}>
			<View style={styles.container}>
				{/* Cabeçalho */}
				<View style={styles.header}>
					<View>
						<Text style={styles.greeting}>
							Olá,{" "}
							{user?.profile?.name?.split(" ")[0] ||
								"voluntário(a)"}
						</Text>
						<Text style={styles.date}>Hoje é {todayText}</Text>
					</View>
					<Ionicons
						name="logo-instagram"
						size={26}
						color={colors.primary}
						onPress={() =>
							Linking.openURL(
								"https://www.instagram.com/fraternidadesemfronteiras"
							)
						}
					/>
				</View>

				{/* Imagem topo com link */}
				<TouchableOpacity
					style={styles.topImageContainer}
					onPress={() =>
						Linking.openURL(
							"https://www.fraternidadesemfronteiras.org.br/apadrinhamento"
						)
					}
					activeOpacity={0.85}
				>
					<Image
						source={require("@/assets/images/apadrinhareamar2024.jpg")}
						style={styles.topImage}
						resizeMode="cover"
					/>
				</TouchableOpacity>

				{/* Grid de ações */}
				<View style={styles.actionGrid}>
					<ActionButton
						icon="search-outline"
						label="Encontrar paciente"
						onPress={() =>
							router.push({
								pathname: "/patients",
								params: { initialFilter: "all" },
							})
						}
					/>
					<ActionButton
						icon="people-outline"
						label="Meus pacientes"
						onPress={() =>
							router.push({
								pathname: "/patients",
								params: { initialFilter: "mine" },
							})
						}
					/>
					<ActionButton
						icon="person-add-outline"
						label="Adicionar paciente"
						onPress={() => router.push("/form/patients")}
					/>
					<ActionButton
						icon="person-circle-outline"
						label="Meu perfil"
						onPress={() => router.push("/profile")}
					/>
				</View>

				{/* Atendimentos recentes */}
				<Text style={styles.sectionTitle}>Atendimentos recentes</Text>

				{loading ? (
					<View style={styles.center}>
						<ActivityIndicator
							size="large"
							color={colors.primary}
						/>
					</View>
				) : (
					<FlatList
						data={recentAppointments}
						keyExtractor={(item) => item.id!}
						renderItem={({ item }) => (
							<AttendancesRow item={item} />
						)}
					/>
				)}
			</View>
		</SafeAreaView>
	);
}

function ActionButton({ icon, label, onPress }: any) {
	return (
		<TouchableOpacity
			style={styles.actionButton}
			onPress={onPress}
			activeOpacity={0.8}
		>
			<Ionicons name={icon} size={26} color={colors.primary} />
			<Text style={styles.actionLabel}>{label}</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
		paddingHorizontal: 20,
		paddingTop: 30,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	greeting: { fontSize: 22, fontWeight: "600", color: colors.textPrimary },
	date: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
	topImageContainer: {
		width: "100%",
		height: 180,
		marginBottom: 10,
		borderRadius: 12,
		overflow: "hidden",
	},
	topImage: { width: "100%", height: "100%" },
	actionGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		marginBottom: 5,
	},
	actionButton: {
		width: "48%",
		backgroundColor: colors.white,
		borderRadius: 10,
		paddingVertical: 10,
		alignItems: "center",
		marginBottom: 8,
		borderWidth: 1,
		borderColor: colors.border,
	},
	actionLabel: {
		color: colors.textPrimary,
		fontSize: 15,
		marginTop: 8,
		fontWeight: "500",
	},
	sectionTitle: {
		fontSize: 17,
		fontWeight: "600",
		color: colors.textPrimary,
		marginBottom: 10,
	},
	center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
