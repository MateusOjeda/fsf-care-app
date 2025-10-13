import {
	DocumentData,
	getDocs,
	query,
	QueryConstraint,
	CollectionReference,
} from "firebase/firestore";
import { convertTimestampsToDates } from "@/src/utils/firebaseUtils";

export type DocumentWithId<T> = {
	id: string;
	data: T;
};

export async function fetchDocumentsWithId<T>(
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
