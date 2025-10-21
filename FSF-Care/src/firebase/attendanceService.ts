// src/firebase/attendanceService.ts
import {
	collection,
	doc,
	DocumentReference,
	QueryConstraint,
	where,
	orderBy,
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
import { Attendance } from "@/src/types";

const attendancesCollection = collection(db, "attendances");

/**
 * Cria um novo atendimento
 * @param attendance Partial<Attendance>
 * @param id opcional para definir manualmente
 */
export async function createAttendance(
	attendance: Partial<Attendance>,
	id?: string
) {
	if (!attendance.userId) throw new Error("Attendance precisa ter userId");
	if (!attendance.patientId)
		throw new Error("Attendance precisa ter patientId");

	const docRef = await addDocSafe(attendancesCollection, attendance, id);
	return docRef.id;
}

/**
 * Atualiza um atendimento existente a partir da referência
 */
export async function updateAttendance(
	attendanceRef: DocumentReference<Attendance>,
	attendance: Partial<Attendance>
) {
	await updateDocSafe(attendanceRef, attendance);
}

/**
 * Atualiza atendimento pelo ID
 */
export async function updateAttendanceById(
	id: string,
	attendance: Partial<Attendance>
) {
	const attendanceRef = doc(
		db,
		"attendances",
		id
	) as DocumentReference<Attendance>;
	await updateDocSafe(attendanceRef, attendance);
}

/**
 * Busca um atendimento pelo ID
 */
export async function getAttendanceById(
	id: string
): Promise<Attendance | null> {
	const attendanceRef = doc(
		db,
		"attendances",
		id
	) as DocumentReference<Attendance>;
	return await getDocSafeWithId<Attendance>(attendanceRef);
}

/**
 * Deleta um atendimento pelo ID
 */
export async function deleteAttendanceById(id: string) {
	const attendanceRef = doc(
		db,
		"attendances",
		id
	) as DocumentReference<Attendance>;
	await deleteDocSafe(attendanceRef);
}

/**
 * Busca todos os atendimentos ou com constraints
 */
export async function fetchAttendances(
	constraints: QueryConstraint[] = []
): Promise<DocumentWithId<Attendance>[]> {
	// Ordena por criado em ordem decrescente por padrão
	const orderedConstraints = [...constraints, orderBy("createdAt", "desc")];
	return await fetchDocumentsWithIdSafe<Attendance>(
		attendancesCollection,
		orderedConstraints
	);
}

/**
 * Busca atendimentos de um usuário específico
 */
export async function getAttendancesByUser(
	userId: string
): Promise<DocumentWithId<Attendance>[]> {
	const constraints: QueryConstraint[] = [where("userId", "==", userId)];
	return await fetchDocumentsWithIdSafe<Attendance>(
		attendancesCollection,
		constraints
	);
}

/**
 * Retorna referência para um atendimento
 */
export function getAttendanceRef(id: string): DocumentReference<Attendance> {
	return doc(db, "attendances", id) as DocumentReference<Attendance>;
}
