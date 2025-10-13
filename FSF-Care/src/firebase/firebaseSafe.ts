import {
	addDoc,
	setDoc,
	doc,
	updateDoc,
	CollectionReference,
	DocumentReference,
} from "firebase/firestore";
import {
	convertDatesToTimestamps,
	removeUndefined,
} from "@/src/utils/firebaseUtils";

type FirestoreData = Record<string, any>;

export async function addDocSafe(
	collectionRef: CollectionReference<any>,
	data: Record<string, any>,
	id?: string
) {
	const payload = removeUndefined(convertDatesToTimestamps(data));

	if (id) {
		return setDoc(doc(collectionRef, id), payload);
	} else {
		return addDoc(collectionRef, payload);
	}
}

export async function updateDocSafe(
	docRef: DocumentReference<FirestoreData>,
	data: Record<string, any>
) {
	const payload = removeUndefined(convertDatesToTimestamps(data));
	return updateDoc(docRef, payload);
}
