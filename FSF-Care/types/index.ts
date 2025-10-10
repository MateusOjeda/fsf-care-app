export type UserRole = "admin" | "medico" | "psicossocial" | "geral";

export type User = {
	uid: string;
	name?: string;
	email: string;
	role?: UserRole;
	active: boolean;
};

export type AccessCode = {
	code: string;
	role: UserRole;
	usedBy: string[];
	maxUses: number;
	expiresAt: Date;
};

export type Patient = {
	id: string;
	name: string;
	identityNumber: string;
	psychosocialLimited: any[];
	psychosocialAdvanced: any[];
	medicalRecords: any[];
	historyEdits: { userId: string; timestamp: number; changes: string }[];
};
