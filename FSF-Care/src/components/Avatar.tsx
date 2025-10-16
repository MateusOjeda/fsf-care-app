import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/src/theme/colors";

type AvatarProps = {
	photoURL?: string;
	size?: number;
	borderColor?: string;
	borderWidth?: number;
	editable?: boolean;
	onPress?: () => void;
};

export default function Avatar({
	photoURL,
	size = 130,
	borderColor = colors.primary,
	borderWidth = 3,
	editable = false,
	onPress,
}: AvatarProps) {
	const pencilSize = size * 0.14;
	const editContainerSize = pencilSize + 17;

	return (
		<TouchableOpacity
			onPress={editable ? onPress : undefined}
			activeOpacity={editable ? 0.7 : 1}
		>
			<View style={{ width: size, height: size }}>
				{/* Avatar circular */}
				<View
					style={[
						styles.container,
						{
							width: size,
							height: size,
							borderRadius: size / 2,
							borderColor: borderColor,
							borderWidth: borderWidth,
						},
					]}
				>
					{photoURL ? (
						<Image
							source={{ uri: photoURL }}
							style={{
								width: size,
								height: size,
								borderRadius: size / 2,
							}}
						/>
					) : (
						<View style={styles.placeholder}>
							<Ionicons
								name="person-sharp"
								size={size / 2}
								color={colors.border}
							/>
						</View>
					)}
				</View>

				{/* Ícone de edição proporcional */}
				{editable && (
					<View
						style={[
							styles.editIconContainer,
							{
								width: editContainerSize,
								height: editContainerSize,
								borderRadius: editContainerSize / 2,
								bottom: 0,
								right: 0,
							},
						]}
					>
						<Ionicons
							name="pencil"
							size={pencilSize}
							color="#fff"
						/>
					</View>
				)}
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		overflow: "hidden",
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowRadius: 4,
		shadowOffset: { width: 0, height: 2 },
		elevation: 3,
	},
	placeholder: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	editIconContainer: {
		position: "absolute",
		backgroundColor: colors.primary,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 2,
		borderColor: "#fff",
		elevation: 4,
		shadowColor: "#000",
		shadowOpacity: 0.2,
		shadowRadius: 2,
		shadowOffset: { width: 0, height: 1 },
	},
});
