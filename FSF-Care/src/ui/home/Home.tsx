// src/screens/HomeScreen.tsx
import React, { useContext } from "react";
import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	FlatList,
	Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { AuthContext } from "@/src/context/AuthContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import colors from "@/src/theme/colors";

export default function HomeComponent() {
	const { user } = useContext(AuthContext);
	const router = useRouter();

	const recentAppointments = [
		{
			id: "1",
			name: "João Silva",
			desc: "Atendimento geral",
			date: "Hoje",
			avatar: "https://randomuser.me/api/portraits/men/45.jpg",
		},
		{
			id: "2",
			name: "Ana Pereira",
			desc: "Retorno",
			date: "Ontem",
			avatar: "https://randomuser.me/api/portraits/women/47.jpg",
		},
		{
			id: "3",
			name: "Carlos Souza",
			desc: "Primeira triagem",
			date: "20/10",
			avatar: "https://randomuser.me/api/portraits/men/33.jpg",
		},
	];

	const today = format(new Date(), "dd 'de' MMMM 'de' yyyy", {
		locale: ptBR,
	});

	return (
		<View style={styles.container}>
			{/* Saudação */}
			<View style={styles.header}>
				<View>
					<Text style={styles.greeting}>
						Olá,{" "}
						{user?.profile?.name?.split(" ")[0] || "voluntário(a)"}
					</Text>
					<Text style={styles.date}>Hoje é {today}</Text>
				</View>
				<Ionicons
					name="logo-instagram" // ou "logo-facebook", "logo-twitter"
					size={26}
					color={colors.primary}
					onPress={() =>
						Linking.openURL(
							"https://www.instagram.com/fraternidadesemfronteiras"
						)
					}
					style={{ marginLeft: 10 }}
				/>
			</View>

			{/* Imagem de topo com link */}
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

			{/* Ações principais (grid 2x2) */}
			<View style={styles.actionGrid}>
				<ActionButton
					icon="search-outline"
					label="Encontrar paciente"
					onPress={() =>
						router.push({
							pathname: "/admin/patients",
							params: { initialFilter: "all" },
						})
					}
				/>
				<ActionButton
					icon="people-outline"
					label="Meus pacientes"
					onPress={() =>
						router.push({
							pathname: "/admin/patients",
							params: { initialFilter: "mine" },
						})
					}
				/>
				<ActionButton
					icon="person-add-outline"
					label="Adicionar paciente"
					onPress={() => router.push("/patients/form")}
				/>
				<ActionButton
					icon="person-circle-outline"
					label="Meu perfil"
					onPress={() => router.push("/profile/form")}
				/>
			</View>

			{/* Lista de atendimentos recentes */}
			<Text style={styles.sectionTitle}>Atendimentos recentes</Text>
			<FlatList
				data={recentAppointments}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<View style={styles.listItem}>
						<Image
							source={{ uri: item.avatar }}
							style={styles.listAvatar}
						/>
						<View style={{ flex: 1 }}>
							<Text style={styles.listName}>{item.name}</Text>
							<Text style={styles.listDesc}>{item.desc}</Text>
						</View>
						<Text style={styles.listDate}>{item.date}</Text>
					</View>
				)}
			/>
		</View>
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
		marginBottom: 18,
	},
	greeting: {
		fontSize: 22,
		fontWeight: "600",
		color: colors.textPrimary,
	},
	date: {
		fontSize: 14,
		color: colors.textSecondary,
		marginTop: 4,
	},

	/* imagem de topo */
	topImageContainer: {
		width: "100%",
		height: 180,
		marginBottom: 20,
		borderRadius: 12,
		overflow: "hidden",
	},
	topImage: {
		width: "100%",
		height: "100%",
	},

	/* grid de ações */
	actionGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		marginBottom: 20,
	},
	actionButton: {
		width: "48%",
		backgroundColor: colors.white,
		borderRadius: 10,
		paddingVertical: 18,
		alignItems: "center",
		marginBottom: 12,
		borderWidth: 1,
		borderColor: colors.border,
	},
	actionLabel: {
		color: colors.textPrimary,
		fontSize: 15,
		marginTop: 8,
		fontWeight: "500",
	},

	/* lista */
	sectionTitle: {
		fontSize: 17,
		fontWeight: "600",
		color: colors.textPrimary,
		marginBottom: 10,
	},
	listItem: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.white,
		borderRadius: 10,
		padding: 12,
		marginBottom: 10,
		borderWidth: 1,
		borderColor: colors.border,
	},
	listAvatar: {
		width: 46,
		height: 46,
		borderRadius: 23,
		marginRight: 12,
	},
	listName: {
		fontSize: 16,
		fontWeight: "500",
		color: colors.textPrimary,
	},
	listDesc: {
		fontSize: 14,
		color: colors.textSecondary,
	},
	listDate: {
		fontSize: 13,
		color: colors.textSecondary,
	},
});
