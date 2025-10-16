import React from "react";
import { Image, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type AvatarProps = {
	photoURL?: string;
	size?: number;
	borderColor?: string;
	borderWidth?: number;
};

export default function Avatar({
	photoURL,
	size = 100,
	borderColor = "#3D8361",
	borderWidth = 3,
}: AvatarProps) {
	return (
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
					style={[
						styles.image,
						{ width: size, height: size, borderRadius: size / 2 },
					]}
				/>
			) : (
				<View style={styles.placeholder}>
					<Ionicons
						name="person-sharp"
						size={size / 2}
						color="#D3D3D3"
					/>
				</View>
			)}
		</View>
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
		elevation: 3, // Android
	},
	image: {
		resizeMode: "cover",
	},
	placeholder: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
});
