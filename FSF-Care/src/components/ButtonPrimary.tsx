import React from "react";
import {
	TouchableOpacity,
	Text,
	StyleSheet,
	GestureResponderEvent,
	View,
	ActivityIndicator,
} from "react-native";
import colors from "@/src/theme/colors";

interface ButtonPrimaryProps {
	title: string;
	onPress: (event: GestureResponderEvent) => void;
	color?: string;
	loading?: boolean;
	disabled?: boolean;
	children?: React.ReactNode; // ícone ou outro elemento
	style?: object;
	textStyle?: object;
}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
	title,
	onPress,
	color = colors.primary,
	loading = false,
	disabled,
	children,
	style,
	textStyle,
}) => {
	return (
		<TouchableOpacity
			style={[
				styles.button,
				{
					backgroundColor: color,
					opacity: loading || disabled ? 0.6 : 1,
				},
				style,
			]}
			onPress={onPress}
			activeOpacity={0.8}
			disabled={loading || disabled}
		>
			<View style={styles.content}>
				{loading ? (
					<ActivityIndicator color="#fff" />
				) : (
					<>
						{children && (
							<View style={styles.icon}>{children}</View>
						)}
						<Text style={[styles.buttonText, textStyle]}>
							{title}
						</Text>
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
