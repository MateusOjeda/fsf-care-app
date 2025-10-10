import { auth, db } from "./config";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
	doc,
	getDoc,
	collection,
	query,
	where,
	getDocs,
	updateDoc,
} from "firebase/firestore";
import { User } from "../types";

// Login com email/senha
export async function loginUser(
	email: string,
	password: string
): Promise<User> {
	const userCredential = await signInWithEmailAndPassword(
		auth,
		email,
		password
	);
	const uid = userCredential.user.uid;

	const userDoc = await getDoc(doc(db, "users", uid));
	if (!userDoc.exists()) {
		throw new Error(
			"Usuário não encontrado. Talvez precise de um access code."
		);
	}
	const data = userDoc.data(); // dados do Firestore, sem uid
	const expiresAtDate = data.expiresAt ? data.expiresAt.toDate() : undefined;

	const userData: User = {
		...data,
		uid: userDoc.id,
		expiresAt: expiresAtDate,
	} as User;

	if (!userData.active) {
		throw new Error("Sua conta ainda não foi ativada.");
	}

	return userData;
}

// Validar access code
export async function validateAccessCode(
	code: string,
	userId: string
): Promise<void> {
	const q = query(collection(db, "accessCodes"), where("code", "==", code));
	const querySnapshot = await getDocs(q);

	if (querySnapshot.empty) {
		throw new Error("Código inválido");
	}

	const accessDoc = querySnapshot.docs[0];
	const accessData = accessDoc.data();

	// Marca que o usuário usou o access code
	await updateDoc(accessDoc.ref, {
		usedBy: accessData.usedBy ? [...accessData.usedBy, userId] : [userId],
	});

	// Aqui você poderia criar/ativar o usuário no Firestore
}
