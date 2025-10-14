export type UserRole = "admin" | "medico" | "psicossocial" | "geral";

export type UserProfileIdType = "RG" | "CPF" | "Outro";

export interface UserProfile {
	name?: string;
	birthDate?: Date;
	documentIdType?: UserProfileIdType;
	documentId?: string;
	crm?: string; // para médicos
}

export interface User {
	uid: string;
	name?: string;
	email: string;
	role?: UserRole;
	active: boolean;
	expiresAt?: Date;
	profile?: UserProfile;
}

export interface AccessCode {
	code: string;
	role: UserRole;
	usedBy: string[];
	maxUses: number;
	expiresAt: Date;
	durationDays?: number;
}

export interface Patient {
	id: string;
	name: string;
	identityNumber: string;
	psychosocialLimited: any[];
	psychosocialAdvanced: any[];
	medicalRecords: any[];
	historyEdits: { userId: string; timestamp: number; changes: string }[];
}
