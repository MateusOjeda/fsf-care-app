import { db } from "./config";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { UserProfile, User } from "../types";
import { convertTimestampsToDates } from "../utils/firebaseUtils";

export async function updateUserProfile(
	uid: string,
	profile: UserProfile
): Promise<User> {
	const userRef = doc(db, "users", uid);
	await updateDoc(userRef, { profile });

	const updatedDoc = await getDoc(userRef);
	const data = convertTimestampsToDates(updatedDoc.data()!);
	return { ...data, uid: updatedDoc.id } as User;
}
