import { Timestamp } from "firebase/firestore";

export function convertTimestampsToDates<T extends Record<string, any>>(
	obj: T
): T {
	const result: any = {};

	for (const [key, value] of Object.entries(obj)) {
		if (value instanceof Timestamp) {
			result[key] = value.toDate();
		} else if (
			value &&
			typeof value === "object" &&
			!Array.isArray(value)
		) {
			result[key] = convertTimestampsToDates(value);
		} else {
			result[key] = value;
		}
	}

	return result;
}

export function convertDatesToTimestamps<T extends Record<string, any>>(
	obj: T
): T {
	const result: any = {};

	for (const [key, value] of Object.entries(obj)) {
		if (value instanceof Date) {
			result[key] = Timestamp.fromDate(value);
		} else if (
			value &&
			typeof value === "object" &&
			!Array.isArray(value)
		) {
			result[key] = convertDatesToTimestamps(value); // recursive for nested objects
		} else {
			result[key] = value;
		}
	}

	return result;
}

export function removeUndefined<T extends Record<string, any>>(
	obj: T
): Partial<T> {
	if (Array.isArray(obj)) {
		return obj
			.map((v) => removeUndefined(v))
			.filter((v) => v !== undefined) as any;
	} else if (obj && typeof obj === "object") {
		return Object.fromEntries(
			Object.entries(obj)
				.filter(([, v]) => v !== undefined)
				.map(([k, v]) => [k, removeUndefined(v)])
		) as Partial<T>;
	}
	return obj;
}

export function parseUserFromStorage(stored: string) {
	const parsed = JSON.parse(stored);

	// expiresAt
	if (parsed.expiresAt && typeof parsed.expiresAt === "string") {
		parsed.expiresAt = new Date(parsed.expiresAt);
	}

	// profile.birthDate
	if (parsed.profile?.birthDate) {
		const bd = parsed.profile.birthDate;
		if (typeof bd === "string") parsed.profile.birthDate = new Date(bd);
		// caso seja Timestamp do Firestore
		if (bd.seconds) parsed.profile.birthDate = new Date(bd.seconds * 1000);
	}

	return parsed;
}
