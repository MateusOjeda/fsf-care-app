import { db } from "./_config";
import { addDocSafe, updateDocSafe } from "./_firebaseSafe";
import { doc, collection } from "firebase/firestore";
import { Patient, CareSheetAnswers } from "../types";

/**
 * Salva uma nova CareSheet para um paciente
 * @param patient Paciente que receberá a ficha
 * @param answers Respostas da ficha
 * @param version Versão da ficha
 * @returns id do documento da CareSheet
 */
export async function saveCareSheet(
	patient: Patient,
	answers: CareSheetAnswers,
	version: string = "v1"
) {
	if (!patient.id) throw new Error("Paciente precisa ter id");

	const careSheetData = {
		patientId: patient.id,
		version,
		answers, // aqui só guardamos { "idPergunta": resposta }
		createdAt: new Date(),
		createdBy: patient.createdBy || null,
	};

	// salva no careSheets
	const careSheetRef = await addDocSafe(
		collection(db, "careSheets"),
		careSheetData
	);

	// atualiza o patient adicionando o careSheetId
	const patientRef = doc(db, "patients", patient.id);
	const updatedCareSheetIds = [
		...(patient.careSheetIds || []),
		careSheetRef.id,
	];
	await updateDocSafe(patientRef, { careSheetIds: updatedCareSheetIds });

	return careSheetRef.id;
}
