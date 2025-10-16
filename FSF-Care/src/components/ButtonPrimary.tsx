import React from "react";
import {
	TouchableOpacity,
	Text,
	StyleSheet,
	GestureResponderEvent,
	View,
	ActivityIndicator,
} from "react-native";

interface ButtonPrimaryProps {
	title: string;
	onPress: (event: GestureResponderEvent) => void;
	color?: string;
	loading?: boolean;
	children?: React.ReactNode; // ícone ou outro elemento
}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
	title,
	onPress,
	color = "#3D8361",
	loading = false,
	children,
}) => {
	return (
		<TouchableOpacity
			style={[
				styles.button,
				{ backgroundColor: color, opacity: loading ? 0.6 : 1 },
			]}
			onPress={onPress}
			activeOpacity={0.8}
			disabled={loading}
		>
			<View style={styles.content}>
				{loading ? (
					<ActivityIndicator color="#fff" />
				) : (
					<>
						{children && (
							<View style={styles.icon}>{children}</View>
						)}
						<Text style={styles.buttonText}>{title}</Text>
					</>
				)}
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	button: {
		width: "100%",
		paddingVertical: 16,
		borderRadius: 10,
		alignItems: "center",
		marginTop: 12,
	},
	content: {
		flexDirection: "row", // 👈 ícone e texto lado a lado
		alignItems: "center",
		justifyContent: "center",
	},
	icon: {
		marginRight: 8, // 👈 espaço entre o ícone e o texto
	},
	buttonText: {
		color: "#fff",
		fontWeight: "600",
		fontSize: 16,
		textAlign: "center",
	},
});

export default ButtonPrimary;
