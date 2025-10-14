import { db } from "@/src/firebase/_config";
import {
	addDocSafe,
	updateDocSafe,
	fetchDocumentsWithIdSafe,
	DocumentWithId,
} from "@/src/firebase/_firebaseSafe";
import { collection, doc, where } from "firebase/firestore";
import { AccessCode, User } from "@/src/types";

export type AccessCodeWithId = {
	id: string;
	data: AccessCode;
};

export async function fetchAccessCode(
	code: string
): Promise<DocumentWithId<AccessCode> | null> {
	const results = await fetchDocumentsWithIdSafe<AccessCode>(
		collection(db, "accessCodes"),
		[where("code", "==", code)]
	);

	return results[0] ?? null;
}

// Mark that a user has used an access code
export async function markAccessCodeUsed(
	accessDoc: DocumentWithId<AccessCode>,
	userId: string
) {
	await updateDocSafe(doc(db, "accessCodes", accessDoc.id), {
		usedBy: [...accessDoc.data.usedBy, userId],
	});
}

// Update a user’s role and expiration
export async function updateUserAccess({
	user,
	role,
	expiresAt,
	active,
}: {
	user: User;
	role: AccessCode["role"];
	expiresAt?: Date;
	active?: boolean;
}) {
	const userRef = doc(db, "users", user.uid);
	await updateDocSafe(userRef, { ...user, role, expiresAt, active });
}

// Create a new access code
export async function createAccessCode(accessCode: AccessCode) {
	await addDocSafe(collection(db, "accessCodes"), accessCode);
}
