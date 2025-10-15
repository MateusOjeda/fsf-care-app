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
	photoURL?: string;
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
	id?: string;
	createdBy: string;
	name: string;
	birthDate?: Date;
	documentId?: string;
	phone?: string;
	address?: string;
	notes?: string;
	createdAt?: Date;
	photoURL?: string;
	photoThumbnailURL?: string;
}
