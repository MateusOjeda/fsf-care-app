// src/components/Avatar.tsx
import React from "react";
import { Image, View, StyleSheet } from "react-native";

type AvatarProps = {
	photoURL?: string;
	size?: number;
};

export default function Avatar({ photoURL, size = 50 }: AvatarProps) {
	return (
		<View
			style={[
				styles.container,
				{ width: size, height: size, borderRadius: size / 2 },
			]}
		>
			<Image
				source={
					photoURL
						? { uri: photoURL }
						: require("@/assets/images/default-profile.png")
				}
				style={[
					styles.image,
					{ width: size, height: size, borderRadius: size / 2 },
				]}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		overflow: "hidden",
		backgroundColor: "#eee",
	},
	image: {
		resizeMode: "cover",
	},
});
