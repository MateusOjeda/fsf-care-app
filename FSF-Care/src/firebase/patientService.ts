// src/firebase/patientService.ts
import {
	collection,
	doc,
	DocumentReference,
	QueryConstraint,
	where,
} from "firebase/firestore";
import { db } from "@/src/firebase/_config";
import {
	addDocSafe,
	deleteDocSafe,
	updateDocSafe,
	getDocSafeWithId,
	fetchDocumentsWithIdSafe,
	DocumentWithId,
} from "@/src/firebase/_firebaseSafe";
import { Patient } from "../types";

/**
 * Cria um novo paciente no Firestore.
 * @param patient Objeto Partial<Patient> com os dados do paciente
 * @param id Opcional, se quiser definir manualmente o id do documento
 */
export async function createPatient(patient: Partial<Patient>, id?: string) {
	if (!patient.createdBy) throw new Error("Paciente precisa ter createdBy");
	const docRef = await addDocSafe(collection(db, "patients"), patient, id);
	return docRef.id;
}

/**
 * Atualiza um paciente existente
 * @param patientRef Referência do paciente (doc)
 * @param patient Dados para atualizar
 */
export async function updatePatient(
	patientRef: DocumentReference<Patient>,
	patient: Partial<Patient>
) {
	await updateDocSafe(patientRef, patient);
}

export async function updatePatientById(id: string, patient: Partial<Patient>) {
	const patientRef = doc(db, "patients", id);
	await updateDocSafe(patientRef, patient);
}

/**
 * Busca um paciente pelo ID
 */
export async function getPatientById(id: string): Promise<Patient | null> {
	const patientRef = doc(db, "patients", id) as DocumentReference<Patient>;
	return await getDocSafeWithId<Patient>(patientRef);
}

/**
 * Deleta um paciente pelo ID
 * @param id ID do paciente
 */
export async function deletePatient(id: string) {
	const patientRef = doc(db, "patients", id) as DocumentReference<Patient>;
	await deleteDocSafe(patientRef);
}

/**
 * Busca todos os pacientes ou com constraints (ex: filtros)
 */
export async function fetchPatients(
	constraints: QueryConstraint[] = []
): Promise<DocumentWithId<Patient>[]> {
	return await fetchDocumentsWithIdSafe<Patient>(
		collection(db, "patients"),
		constraints
	);
}

/**
 * Busca todos os pacientes de um usuário
 * @param userId UID do usuário
 */
export async function getPatientsByUser(
	userId: string
): Promise<DocumentWithId<Patient>[]> {
	const constraints: QueryConstraint[] = [where("createdBy", "==", userId)];
	return await fetchDocumentsWithIdSafe<Patient>(
		collection(db, "patients"),
		constraints
	);
}

export function getPatientRef(id: string): DocumentReference<Patient> {
	return doc(db, "patients", id) as DocumentReference<Patient>;
}
