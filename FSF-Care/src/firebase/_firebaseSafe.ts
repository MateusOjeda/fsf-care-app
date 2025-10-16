import {
	addDoc,
	setDoc,
	getDoc,
	deleteDoc,
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
		const docRef = doc(collectionRef, id);
		await setDoc(docRef, payload);
		return docRef; // retorna manualmente o docRef
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

export async function deleteDocSafe(docRef: DocumentReference) {
	try {
		await deleteDoc(docRef);
	} catch (err) {
		console.error("Erro ao deletar documento:", err);
		throw err;
	}
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

export async function getDocSafeWithId<T>(
	docRef: DocumentReference<T>
): Promise<(T & { id: string }) | null> {
	const docSnap = await getDoc(docRef);
	if (!docSnap.exists()) return null;

	const rawData = docSnap.data() as Record<string, any>;
	const data = convertTimestampsToDates(rawData) as T;

	// Retorna o objeto com o id do documento incluído
	return { id: docSnap.id, ...data } as T & { id: string };
}
