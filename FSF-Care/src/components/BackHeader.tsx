import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type BackHeaderProps = {
	title?: string;
	onPress?: () => void;
};

export default function BackHeader({ title, onPress }: BackHeaderProps) {
	const router = useRouter();

	return (
		<View style={styles.container}>
			<TouchableOpacity
				style={styles.backButton}
				onPress={onPress === undefined ? router.back : onPress}
			>
				<Ionicons name="chevron-back" size={24} color="#007AFF" />
				<Text style={styles.backText}>Voltar</Text>
			</TouchableOpacity>

			{title && <Text style={styles.title}>{title}</Text>}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		height: 60,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center", // centraliza título horizontalmente
		backgroundColor: "#fff",
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
		paddingHorizontal: 16,
		position: "relative",
	},
	backButton: {
		position: "absolute", // fixa o botão na extrema esquerda
		left: 8,
		flexDirection: "row",
		alignItems: "center",
	},
	backText: {
		color: "#007AFF",
		fontSize: 16,
		marginLeft: 4,
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
		textAlign: "center",
	},
});
