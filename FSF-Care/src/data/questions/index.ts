import QUESTIONS_V1 from "@/src/data/questions/questions_v1";

export const QUESTION_SETS = {
	v1: QUESTIONS_V1,
} as const;

export type QuestionVersion = keyof typeof QUESTION_SETS;

/**
 * Retorna o conjunto de perguntas conforme a versão.
 */
export function getQuestionsByVersion(version: QuestionVersion) {
	return QUESTION_SETS[version];
}
