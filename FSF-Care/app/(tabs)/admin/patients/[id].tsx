// app/patients/[id].tsx
import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	ActivityIndicator,
	StyleSheet,
	Alert,
	Button,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getPatientById } from "@/src/firebase/patientService";
import { Patient } from "@/src/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import BackHeader from "@/src/components/BackHeader";
import { deletePatient } from "@/src/firebase/patientService";

export default function PatientDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const [patient, setPatient] = useState<Patient | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	const handleEdit = (id: string) => {
		router.push({
			pathname: "/patients/form",
			params: { id },
		});
	};

	const handleDelete = (id: string) => {
		Alert.alert(
			"Confirmação",
			"Tem certeza que deseja deletar este paciente?",
			[
				{ text: "Cancelar", style: "cancel" },
				{
					text: "Deletar",
					style: "destructive",
					onPress: async () => {
						try {
							await deletePatient(id);
							Alert.alert("Sucesso", "Paciente deletado!");
							router.replace("/admin/patients");
						} catch (err) {
							console.error(err);
							Alert.alert(
								"Erro",
								"Não foi possível deletar o paciente"
							);
						}
					},
				},
			]
		);
	};

	useEffect(() => {
		if (!id) return;

		const fetchPatient = async () => {
			try {
				const data = await getPatientById(id);
				if (!data) {
					Alert.alert("Erro", "Paciente não encontrado");
					return;
				}
				setPatient(data);
			} catch (err) {
				console.error(err);
				Alert.alert("Erro", "Não foi possível carregar o paciente");
			} finally {
				setLoading(false);
			}
		};

		fetchPatient();
	}, [id]);

	if (loading) {
		return (
			<View style={styles.center}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	if (!patient) {
		return (
			<View style={styles.center}>
				<Text>Paciente não encontrado</Text>
			</View>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<BackHeader
				title="Perfil do Paciente"
				onPress={() => router.replace(`/admin/patients`)}
			/>
			<Text style={styles.label}>Nome:</Text>
			<Text style={styles.value}>{patient.name}</Text>

			<Text style={styles.label}>Data de nascimento:</Text>
			<Text style={styles.value}>
				{patient.birthDate
					? new Date(patient.birthDate).toLocaleDateString()
					: "-"}
			</Text>

			<Text style={styles.label}>Documento:</Text>
			<Text style={styles.value}>{patient.documentId || "-"}</Text>

			<Text style={styles.label}>Telefone:</Text>
			<Text style={styles.value}>{patient.phone || "-"}</Text>

			<Text style={styles.label}>Endereço:</Text>
			<Text style={styles.value}>{patient.address || "-"}</Text>

			<Text style={styles.label}>Observações:</Text>
			<Text style={styles.value}>{patient.notes || "-"}</Text>
			<Button title="Editar paciente" onPress={() => handleEdit(id)} />
			<Button title="Deletar paciente" onPress={() => handleDelete(id)} />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	center: { flex: 1, justifyContent: "center", alignItems: "center" },
	label: { fontWeight: "bold", marginTop: 12 },
	value: { marginTop: 4 },
});
