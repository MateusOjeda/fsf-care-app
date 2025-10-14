import { collection, where } from "firebase/firestore";
import { User } from "../types";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "@/src/firebase/_config";
import {
	addDocSafe,
	fetchDocumentsWithIdSafe,
	DocumentWithId,
} from "@/src/firebase/_firebaseSafe";

// Login with email/password
export async function loginUser(
	email: string,
	password: string
): Promise<User> {
	// Firebase Auth login
	const userCredential = await signInWithEmailAndPassword(
		auth,
		email,
		password
	);
	const uid = userCredential.user.uid;

	// Fetch the user document using your utility
	const results: DocumentWithId<User>[] =
		await fetchDocumentsWithIdSafe<User>(collection(db, "users"), [
			where("uid", "==", uid),
		]);

	const userDoc = results[0];
	if (!userDoc) {
		throw new Error(
			"Usuário não encontrado. Talvez precise de um access code."
		);
	}

	const userData: User = {
		...userDoc.data,
		uid: userDoc.id,
	};

	return userData;
}

export async function registerUser(
	email: string,
	password: string
): Promise<User> {
	const userCredential = await createUserWithEmailAndPassword(
		auth,
		email,
		password
	);
	const uid = userCredential.user.uid;

	const newUser: User = {
		uid,
		email,
		active: false, // will be activated after access code
	};

	await addDocSafe(collection(db, "users"), newUser, uid);

	return newUser;
}
