import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import colors from "@/src/theme/colors";

type BackHeaderProps = {
	title?: string;
	onPress?: () => void;
	iconColor?: string;
	showBorder?: boolean;
	backgroundColor?: string;
};

export default function BackHeader({
	title,
	onPress,
	iconColor = colors.primary,
	showBorder = false,
	backgroundColor = "transparent", // transparente porque a tela já tem fundo
}: BackHeaderProps) {
	const router = useRouter();

	return (
		<View
			style={[
				styles.container,
				{ backgroundColor },
				showBorder && {
					borderBottomWidth: 1,
					borderBottomColor: colors.grayLight,
				},
			]}
		>
			<TouchableOpacity
				style={styles.backButton}
				onPress={onPress ?? router.back}
				activeOpacity={0.6}
			>
				<Ionicons name="chevron-back" size={26} color={iconColor} />
				<Text style={[styles.backText, { color: iconColor }]}>
					Voltar
				</Text>
			</TouchableOpacity>

			{title && <Text style={styles.title}>{title}</Text>}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		height: 56,
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		position: "relative",
	},
	backButton: {
		position: "absolute",
		left: 16,
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 6,
		paddingHorizontal: 4,
	},
	backText: {
		fontSize: 16,
		marginLeft: 4,
		fontWeight: "500",
	},
	title: {
		fontSize: 18,
		fontWeight: "600",
		color: colors.textPrimary,
	},
});
