import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Avatar from "@/src/components/Avatar";
import colors from "@/src/theme/colors";
import { Attendance } from "../types";

type AttendancesRowProps = {
	attendance: Attendance;
};

export default function AttendancesRow({ attendance }: AttendancesRowProps) {
	return (
		<View style={styles.item}>
			<Avatar
				photoURL={photoURL}
				size={60}
				borderWidth={1}
				borderColor={colors.border}
			/>
			<View style={styles.info}>
				<Text style={styles.name}>{name}</Text>
				<Text style={styles.sub}>{getAge(birthDate)}</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	item: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.cardBackground,
		padding: 12,
		borderRadius: 12,
		marginBottom: 10,
		borderWidth: 1,
		borderColor: colors.border,
		shadowColor: "#000",
		shadowOpacity: 0.05,
		shadowRadius: 4,
		shadowOffset: { width: 0, height: 2 },
		elevation: 2,
	},
	info: { marginLeft: 12, flex: 1 },
	name: { fontWeight: "600", fontSize: 16, color: colors.textPrimary },
	sub: { color: colors.textSecondary, fontSize: 14 },
});
