import { db } from "./_config";
import { addDocSafe, updateDocSafe, getDocSafeWithId } from "./_firebaseSafe";
import { doc, collection, DocumentReference } from "firebase/firestore";
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
