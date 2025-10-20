import React, { useState } from "react";
import {
	View,
	Image,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
	Modal,
	Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/src/theme/colors";
import { set } from "date-fns";

type AvatarProps = {
	photoURL?: string;
	size?: number;
	borderColor?: string;
	borderWidth?: number;
	editable?: boolean;
	onPress?: () => void;
	showFullSize?: boolean;
};

export default function Avatar({
	photoURL,
	size = 130,
	borderColor = colors.primary,
	borderWidth = 3,
	editable = false,
	onPress,
	showFullSize = false,
}: AvatarProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const pencilSize = size * 0.14;
	const editContainerSize = pencilSize + 17;

	const avatarContent = (
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
					<>
						<Image
							source={{ uri: photoURL }}
							style={{
								width: size,
								height: size,
								borderRadius: size / 2,
							}}
							onLoadStart={() => setIsLoading(true)}
							onLoadEnd={() => setIsLoading(false)}
						/>
						{isLoading && (
							<View style={styles.loadingOverlay}>
								<ActivityIndicator
									size="small"
									color={colors.primary}
								/>
							</View>
						)}
					</>
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
					<Ionicons name="pencil" size={pencilSize} color="#fff" />
				</View>
			)}
		</View>
	);

	const shouldBeTouchable = !!onPress || showFullSize;

	return (
		<>
			{shouldBeTouchable ? (
				<TouchableOpacity
					activeOpacity={editable ? 0.7 : 1}
					onPress={onPress ? onPress : () => setShowModal(true)}
				>
					{avatarContent}
				</TouchableOpacity>
			) : (
				avatarContent
			)}

			{/* Modal de foto em tela cheia */}
			<Modal
				visible={!!showModal && !!photoURL}
				transparent={true}
				animationType="fade"
				onRequestClose={() => setShowModal(false)}
			>
				<View style={styles.modalBackground}>
					<Pressable
						style={styles.modalOverlay}
						onPress={() => setShowModal(false)}
					/>
					<View style={styles.modalContent}>
						{photoURL && (
							<Image
								source={{ uri: photoURL }}
								style={styles.fullImage}
								resizeMode="contain"
							/>
						)}
						<TouchableOpacity
							style={styles.closeButton}
							onPress={() => setShowModal(false)}
							activeOpacity={0.7}
						>
							<Ionicons
								name="close"
								size={32}
								color={colors.white}
							/>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		overflow: "hidden",
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
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
	},
	loadingOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "rgba(255,255,255,0.4)",
		borderRadius: 999,
	},
	modalBackground: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.7)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
	modalContent: {
		width: "90%",
		height: "70%",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 20,
		overflow: "hidden",
		backgroundColor: "#222",
	},
	fullImage: {
		width: "100%",
		height: "100%",
	},
	closeButton: {
		position: "absolute",
		top: 16,
		right: 16,
		backgroundColor: "rgba(0,0,0,0.6)",
		borderRadius: 20,
		padding: 4,
	},
});
