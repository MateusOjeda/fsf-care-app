import {
	addDoc,
	setDoc,
	getDoc,
	doc,
	updateDoc,
	CollectionReference,
	DocumentReference,
	DocumentData,
	getDocs,
	query,
	QueryConstraint,
} from "firebase/firestore";
import {
	convertDatesToTimestamps,
	convertTimestampsToDates,
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

export type DocumentWithId<T> = {
	id: string;
	data: T;
};

export async function fetchDocumentsWithIdSafe<T>(
	collectionRef: CollectionReference<DocumentData>,
	constraints: QueryConstraint[] = []
): Promise<DocumentWithId<T>[]> {
	const q = query(collectionRef, ...constraints);
	const snapshot = await getDocs(q);

	return snapshot.docs.map((docSnap) => {
		const data = convertTimestampsToDates(docSnap.data()) as T;
		return { id: docSnap.id, data };
	});
}

export async function getDocSafe<T>(
	docRef: DocumentReference<T>
): Promise<T | null> {
	const docSnap = await getDoc(docRef);
	if (!docSnap.exists()) return null;

	const rawData = docSnap.data() as Record<string, any>; // força tipo para o util
	const data = convertTimestampsToDates(rawData) as T;

	return data;
}
