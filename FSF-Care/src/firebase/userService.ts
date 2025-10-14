import { doc, DocumentReference } from "firebase/firestore";
import { UserProfile, User } from "../types";
import { db } from "@/src/firebase/_config";
import { updateDocSafe, getDocSafe } from "@/src/firebase/_firebaseSafe";

export async function updateUserProfile(
	uid: string,
	profile: UserProfile
): Promise<void> {
	const userRef = doc(db, "users", uid);
	await updateDocSafe(userRef, { profile });
}

export async function getUserData(uid: string): Promise<User | null> {
	const userRef = doc(db, "users", uid) as DocumentReference<User>;
	const userData = await getDocSafe<User>(userRef);
	return userData;
}
