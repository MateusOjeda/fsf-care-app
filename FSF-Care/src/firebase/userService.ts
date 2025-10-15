import { doc, DocumentReference } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { UserProfile, User } from "../types";
import { db } from "@/src/firebase/_config";
import { auth } from "@/src/firebase/_config";
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
	return await getDocSafe<User>(userRef);
}

/**
 * Atualiza campos do usuário no top-level (ex: photoURL, role)
 * @param uid UID do usuário
 * @param data Campos a atualizar
 */
export async function updateUser(uid: string, data: Partial<User>) {
	const userRef = doc(db, "users", uid);
	await updateDocSafe(userRef, data);

	// ✅ sincroniza foto com Firebase Auth, se houver
	if (data.photoURL && auth.currentUser?.uid === uid) {
		await updateProfile(auth.currentUser, {
			photoURL: data.photoURL,
		});
	}
}
