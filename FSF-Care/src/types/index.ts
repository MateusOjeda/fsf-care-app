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
	photoThumbnailURL?: string;
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
	careSheetSummaries?: CareSheetSummary[];
}

// Caresheet:

export type Option = {
	pt: string;
	en: string;
};

export type Question = {
	pergunta_pt: string;
	pergunta_en: string;
	tipo: "texto" | "data" | "multipla_escolha" | "checkbox" | "grupo";
	opcoes?: Option[];
};

export type CareSheetAnswers = {
	[key: string]: any;
};

// 🔹 Metadados do questionário versionado
export type CareSheetVersion = {
	id: string; // ex: "default_care_sheet"
	version: string; // ex: "v1"
	questions: Record<string, Question>;
};

// 🔹 Estrutura que será salva no Firestore
export type CareSheetData = {
	patientId: string;
	questionnaireId: string;
	version: string;
	answers: CareSheetAnswers;
	createdAt: Date;
};

export type CareSheetSummary = {
	id: string;
	version: string;
	createdAt: string;
};
