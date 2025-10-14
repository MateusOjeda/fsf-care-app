import React, { useContext, useEffect, useState } from "react";
import { Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Patient } from "@/src/types";
import {
	createPatient,
	updatePatient,
	getPatientById,
	getPatientRef,
} from "@/src/firebase/patientService";
import { AuthContext } from "@/src/context/AuthContext";
import { useLocalSearchParams } from "expo-router";
import BackHeader from "@/src/components/BackHeader";

export default function PatientFormScreen({ route }: any) {
	const router = useRouter();
	const { id } = useLocalSearchParams<{ id: string }>();
	const isEdit = !!id;
	const { user } = useContext(AuthContext);

	const [patient, setPatient] = useState<Partial<Patient>>({
		name: "",
		documentId: "",
		phone: "",
		address: "",
		notes: "",
		createdBy: user?.uid,
	});

	// string para controlar o TextInput de nascimento
	const [birthDateText, setBirthDateText] = useState("");

	useEffect(() => {
		if (isEdit && id) {
			getPatientById(id).then((data) => {
				if (data) {
					setPatient(data);
					if (data.birthDate) {
						setBirthDateText(
							new Date(data.birthDate).toISOString().slice(0, 10)
						);
					}
				} else {
					Alert.alert("Erro", "Paciente não encontrado");
					// router.replace(`/${user.role}/patients`);
					router.replace(`/admin/patients`);
				}
			});
		}
	}, [id]);

	const handleSave = async () => {
		if (!patient.name) {
			Alert.alert("Erro", "O nome do paciente é obrigatório");
			return;
		}
		if (!user) {
			Alert.alert("Erro", "Usuário não autenticado");
			return;
		}

		try {
			const birthDate = birthDateText
				? new Date(birthDateText)
				: undefined;

			const patientData: Partial<Patient> = {
				...patient,
				birthDate,
				createdBy: user.uid,
			};

			const patientId =
				isEdit && id
					? (await updatePatient(getPatientRef(id), patientData), id)
					: await createPatient(patientData);

			Alert.alert(
				"Sucesso",
				`Paciente ${isEdit ? "atualizado" : "criado"}!`
			);
			// router.replace(`/${user.role}/patients/${id}`);
			router.replace(`/admin/patients/${patientId}`);
		} catch (err) {
			console.error(err);
			Alert.alert("Erro", "Não foi possível salvar o paciente");
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<BackHeader
				title={isEdit ? "Atualizar Paciente" : "Novo Paciente"}
				onPress={() => router.replace(`/admin/patients`)}
			/>
			<Text style={styles.label}>Nome: (obrigatório)</Text>
			<TextInput
				style={styles.input}
				value={patient.name}
				onChangeText={(text) => setPatient({ ...patient, name: text })}
			/>

			<Text style={styles.label}>Data de nascimento (YYYY-MM-DD):</Text>
			<TextInput
				style={styles.input}
				value={birthDateText}
				onChangeText={setBirthDateText}
				placeholder="YYYY-MM-DD"
			/>

			<Text style={styles.label}>Documento:</Text>
			<TextInput
				style={styles.input}
				value={patient.documentId}
				onChangeText={(text) =>
					setPatient({ ...patient, documentId: text })
				}
			/>

			<Text style={styles.label}>Telefone:</Text>
			<TextInput
				style={styles.input}
				value={patient.phone}
				onChangeText={(text) => setPatient({ ...patient, phone: text })}
			/>

			<Text style={styles.label}>Endereço:</Text>
			<TextInput
				style={styles.input}
				value={patient.address}
				onChangeText={(text) =>
					setPatient({ ...patient, address: text })
				}
			/>

			<Text style={styles.label}>Observações:</Text>
			<TextInput
				style={[styles.input, { height: 80 }]}
				value={patient.notes}
				onChangeText={(text) => setPatient({ ...patient, notes: text })}
				multiline
			/>

			<Button
				title={isEdit ? "Atualizar Paciente" : "Criar Paciente"}
				onPress={handleSave}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		padding: 10,
		marginBottom: 12,
		borderRadius: 5,
	},
	label: { fontWeight: "bold", marginBottom: 4 },
});
