// src/components/PatientSearchModal.tsx
import React, { useEffect, useState } from "react";
import {
	Modal,
	View,
	Text,
	FlatList,
	TouchableOpacity,
	TextInput,
	StyleSheet,
	ActivityIndicator,
} from "react-native";
import { fetchPatients } from "@/src/firebase/patientService";
import { Patient } from "@/src/types";
import { DocumentWithId } from "@/src/firebase/_firebaseSafe";
import colors from "@/src/theme/colors";
import Avatar from "@/src/components/Avatar";
import PatientRow from "./PatientRow";

export interface PatientPickerModalProps {
	visible: boolean; // agora existe
	onSelect: (patient: DocumentWithId<Patient>) => void;
	onClose: () => void;
}

export default function PatientSearchModal({
	visible,
	onSelect,
	onClose,
}: PatientPickerModalProps) {
	const [patients, setPatients] = useState<DocumentWithId<Patient>[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");

	useEffect(() => {
		if (!visible) return;

		const fetch = async () => {
			setLoading(true);
			try {
				const docs = await fetchPatients();
				setPatients(docs);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		};
		fetch();
	}, [visible]);

	const filtered = patients.filter((p) =>
		p.data.name.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<Modal visible={visible} animationType="slide" transparent>
			<View style={styles.modalOverlay}>
				<View style={styles.modalContent}>
					<TextInput
						style={styles.searchInput}
						placeholder="Buscar paciente..."
						value={search}
						onChangeText={setSearch}
					/>
					{loading ? (
						<ActivityIndicator
							size="large"
							color={colors.primary}
						/>
					) : (
						<FlatList
							data={filtered}
							keyExtractor={(item) => item.id}
							renderItem={({ item }) => (
								<TouchableOpacity
									onPress={() => onSelect(item)}
								>
									<PatientRow
										photoURL={item.data.photoThumbnailURL}
										name={item.data.name}
										birthDate={item.data.birthDate}
									></PatientRow>
								</TouchableOpacity>
							)}
						/>
					)}
					<TouchableOpacity
						onPress={onClose}
						style={styles.closeButton}
					>
						<Text style={styles.closeText}>Fechar</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "center",
		padding: 20,
	},
	modalContent: {
		backgroundColor: colors.cardBackground,
		borderRadius: 16,
		padding: 20,
		height: "80%",
	},
	searchInput: {
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 10,
		padding: 12,
		marginBottom: 10,
		backgroundColor: colors.white,
		color: colors.textPrimary,
	},
	itemText: {
		fontSize: 16,
		color: colors.textPrimary,
	},
	closeButton: {
		marginTop: 10,
		padding: 12,
		backgroundColor: colors.primary,
		borderRadius: 10,
		alignItems: "center",
	},
	closeText: {
		color: colors.white,
		fontWeight: "600",
		fontSize: 16,
	},
	patientItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
	},
	patientName: {
		fontSize: 16,
		fontWeight: "600",
		color: colors.textPrimary,
	},
	patientSub: {
		fontSize: 14,
		color: colors.textSecondary,
	},
});
