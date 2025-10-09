export type UserRole =
	| "admin"
	| "medico"
	| "psicossocial"
	| "geral"
	| "no_profile";

export type User = {
	id: string;
	name: string;
	role: UserRole;
	active: boolean;
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
