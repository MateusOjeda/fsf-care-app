import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { AuthContext } from "@/src/context/AuthContext";
import Avatar from "@/src/components/Avatar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ButtonPrimary from "@/src/components/ButtonPrimary";
import LogoutButton from "@/src/components/LogoutButton";
import colors from "@/src/theme/colors";
import { GENDER_LABELS } from "@/src/data/labels";

export default function ProfileComponent() {
	const { user } = useContext(AuthContext);
	const router = useRouter();
	const profile = user?.profile;

	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
		>
			{/* Foto de perfil */}
			<View style={styles.photoContainer}>
				<Avatar
					photoURL={user?.photoURL}
					size={200}
					showFullSize={true}
				/>
			</View>

			{/* Nome */}
			<Text style={styles.name}>
				{profile?.name || user?.name || "Usuário"}
			</Text>

			{/* Informações gerais */}
			<View style={styles.infoCard}>
				{user?.email && (
					<InfoRow
						icon="mail-outline"
						label="Email"
						value={user.email}
					/>
				)}
				{user?.role && (
					<InfoRow
						icon="shield-checkmark-outline"
						label="Função"
						value={user.role}
					/>
				)}
				{profile?.birthDate && (
					<InfoRow
						icon="calendar-outline"
						label="Data de nascimento"
						value={format(
							new Date(profile.birthDate),
							"dd/MM/yyyy",
							{ locale: ptBR }
						)}
					/>
				)}
				{profile?.gender && (
					<InfoRow
						icon="calendar-outline"
						label="Gênero"
						value={GENDER_LABELS[profile.gender]}
					/>
				)}
				{profile?.documentId && profile?.documentIdType && (
					<InfoRow
						icon="document-text-outline"
						label={`Documento (${profile.documentIdType})`}
						value={profile.documentId}
					/>
				)}
				{profile?.crm && (
					<InfoRow
						icon="medkit-outline"
						label="CRM"
						value={profile.crm}
					/>
				)}
				{user?.expiresAt && (
					<InfoRow
						icon="time-outline"
						label="Validade"
						value={format(new Date(user.expiresAt), "dd/MM/yyyy", {
							locale: ptBR,
						})}
					/>
				)}
			</View>

			<ButtonPrimary
				title="Editar perfil"
				onPress={() => router.push("/profile/form")}
			>
				<Ionicons
					name="pencil-outline"
					size={20}
					color={colors.white}
				/>
			</ButtonPrimary>

			<LogoutButton />
		</ScrollView>
	);
}

function InfoRow({
	icon,
	label,
	value,
}: {
	icon: React.ComponentProps<typeof Ionicons>["name"];
	label: string;
	value: string;
}) {
	return (
		<View style={styles.infoRow}>
			<Ionicons
				name={icon}
				size={20}
				color={colors.primary}
				style={{ marginRight: 12 }}
			/>
			<View>
				<Text style={styles.infoLabel}>{label}</Text>
				<Text style={styles.infoValue}>{value}</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
		padding: 20,
		paddingTop: 30,
	},
	photoContainer: {
		alignItems: "center",
		marginBottom: 16,
	},
	name: {
		fontSize: 22,
		fontWeight: "600",
		color: colors.textPrimary,
		textAlign: "center",
		marginBottom: 20,
	},
	infoCard: {
		backgroundColor: colors.white,
		borderRadius: 12,
		padding: 16,
		borderWidth: 1,
		borderColor: colors.border,
	},
	infoRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 14,
	},
	infoLabel: {
		fontSize: 14,
		color: colors.textSecondary,
		marginBottom: 2,
	},
	infoValue: {
		fontSize: 16,
		color: colors.textPrimary,
		fontWeight: "500",
	},
	editButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.primary,
		paddingVertical: 14,
		borderRadius: 10,
	},
	editButtonText: {
		color: colors.white,
		fontSize: 16,
		fontWeight: "600",
		marginLeft: 8,
	},
});
