import React from "react";
import { View, StyleSheet, Text } from "react-native";
import colors from "@/src/theme/colors";
import { Patient } from "../types";
import Avatar from "@/src/components/Avatar";

type PatientHeaderProps = {
	patient: Patient;
};

export default function PatientHeader({ patient }: PatientHeaderProps) {
	return (
		<View style={styles.header}>
			<Avatar
				photoURL={patient.photoThumbnailURL}
				photoFullSizeURL={patient.photoURL}
				size={160}
				showFullSize={true}
			/>
			<Text style={styles.name}>{patient.name}</Text>
			<Text style={styles.age}>
				{patient.birthDate
					? `${
							new Date().getFullYear() -
							new Date(patient.birthDate).getFullYear()
					  } anos`
					: "-"}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	header: { alignItems: "center", marginBottom: 20 },
	name: {
		fontSize: 22,
		fontWeight: "600",
		color: colors.textPrimary,
		marginTop: 12,
	},
	age: { fontSize: 16, color: colors.textSecondary, marginTop: 4 },
});
