import { db } from "./_config";
import { addDocSafe, updateDocSafe, getDocSafeWithId } from "./_firebaseSafe";
import {
	doc,
	collection,
	DocumentReference,
	deleteDoc,
} from "firebase/firestore";
import {
	Patient,
	CareSheetAnswers,
	CareSheetSummary,
	CareSheetData,
} from "../types";

export async function saveCareSheet(
	patient: Patient,
	answers: CareSheetAnswers,
	version: string
) {
	if (!patient.id) throw new Error("Paciente precisa ter id");

	const careSheetData = {
		patientId: patient.id,
		version,
		answers,
		createdAt: new Date().toISOString(),
	};

	const careSheetRef = await addDocSafe(
		collection(db, "careSheets"),
		careSheetData
	);

	const summary: CareSheetSummary = {
		id: careSheetRef.id,
		version,
		createdAt: careSheetData.createdAt,
	};

	const updatedCareSheetSummaries = patient.careSheetSummaries
		? [...patient.careSheetSummaries, summary]
		: [summary];

	const patientRef = doc(db, "patients", patient.id);

	await updateDocSafe(patientRef, {
		careSheetSummaries: updatedCareSheetSummaries,
	});

	return careSheetRef.id;
}

/**
 * Busca a ficha pelo ID
 */
export async function getCareSheetById(
	id: string
): Promise<CareSheetData | null> {
	const careSheetRef = doc(
		db,
		"careSheets",
		id
	) as DocumentReference<CareSheetData>;
	return await getDocSafeWithId<CareSheetData>(careSheetRef);
}

/**
 * Deleta uma ficha de cuidado e remove o resumo dela do paciente.
 */
export async function deleteCareSheet(
	patientId: string,
	careSheetId: string
): Promise<void> {
	if (!patientId || !careSheetId)
		throw new Error("IDs do paciente e da ficha são obrigatórios.");

	// Referência da ficha
	const careSheetRef = doc(db, "careSheets", careSheetId);

	// Primeiro, remove o documento da ficha
	await deleteDoc(careSheetRef);

	// Depois, atualiza o paciente
	const patientRef = doc(db, "patients", patientId);

	// Busca o paciente atual para atualizar corretamente
	const patient = await getDocSafeWithId<{
		careSheetSummaries?: CareSheetSummary[];
	}>(patientRef);
	if (!patient) return;

	const updatedSummaries = (patient.careSheetSummaries || []).filter(
		(summary) => summary.id !== careSheetId
	);

	await updateDocSafe(patientRef, {
		careSheetSummaries: updatedSummaries,
	});
}
