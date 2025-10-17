// CareSheetModal.tsx
import React, { useState } from "react";
import {
	View,
	Text,
	Modal,
	StyleSheet,
	TouchableOpacity,
	TextInput,
	ScrollView,
	Button,
} from "react-native";
import DateInput from "@/src/components/DateInput";
import { Patient, CareSheetAnswers, Option, Question } from "@/src/types";
import colors from "@/src/theme/colors";
import { getQuestionsByVersion, QuestionVersion } from "@/src/data/questions";
import { saveCareSheet } from "@/src/firebase/careSheetService";

type CareSheetModalProps = {
	visible: boolean;
	onClose: () => void;
	patient: Patient;
	version?: QuestionVersion;
};

export default function CareSheetModal({
	visible,
	onClose,
	patient,
	version = "v1",
}: CareSheetModalProps) {
	const [started, setStarted] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [answers, setAnswers] = useState<CareSheetAnswers>({});

	const QUESTIONS = getQuestionsByVersion(version);
	const questionKeys = Object.keys(QUESTIONS);
	const currentQuestion = QUESTIONS[questionKeys[currentIndex]];

	const handleNext = () => {
		if (currentIndex + 1 < questionKeys.length)
			setCurrentIndex(currentIndex + 1);
	};

	const handlePrev = () => {
		if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
	};

	const handleCancel = () => {
		setStarted(false);
		setCurrentIndex(0);
		setAnswers({});
		onClose();
	};

	const handleSave = async () => {
		if (!patient) return;

		try {
			const careSheetId = await saveCareSheet(patient, answers, version);
			console.log("CareSheet salva com sucesso:", careSheetId);

			// resetar estado
			handleCancel();
		} catch (error) {
			console.error("Erro ao salvar CareSheet:", error);
			alert("Não foi possível salvar a ficha. Tente novamente.");
		}
	};

	const handleAnswerChange = (value: any) => {
		setAnswers({ ...answers, [questionKeys[currentIndex]]: value });
	};

	const renderQuestionInput = () => {
		if (!currentQuestion) return null;

		switch (currentQuestion.tipo) {
			case "texto":
				return (
					<TextInput
						style={styles.input}
						placeholder={currentQuestion.pergunta_pt}
						value={answers[questionKeys[currentIndex]] || ""}
						onChangeText={handleAnswerChange}
					/>
				);

			case "data":
				return (
					<DateInput
						value={answers[questionKeys[currentIndex]] || null}
						onChange={handleAnswerChange}
						placeholder={currentQuestion.pergunta_pt}
					/>
				);

			case "multipla_escolha":
			case "checkbox":
				if (!("opcoes" in currentQuestion) || !currentQuestion.opcoes)
					return null;

				const selected: string[] =
					currentQuestion.tipo === "checkbox"
						? answers[questionKeys[currentIndex]] || []
						: [];

				return currentQuestion.opcoes.map((opt: Option) => (
					<TouchableOpacity
						key={opt.pt}
						style={[
							styles.optionButton,
							(currentQuestion.tipo === "multipla_escolha" &&
								answers[questionKeys[currentIndex]] ===
									opt.pt) ||
							(currentQuestion.tipo === "checkbox" &&
								selected.includes(opt.pt))
								? styles.optionSelected
								: undefined,
						]}
						onPress={() => {
							if (currentQuestion.tipo === "multipla_escolha") {
								handleAnswerChange(opt.pt);
							} else if (currentQuestion.tipo === "checkbox") {
								if (selected.includes(opt.pt)) {
									handleAnswerChange(
										selected.filter((s) => s !== opt.pt)
									);
								} else {
									handleAnswerChange([...selected, opt.pt]);
								}
							}
						}}
					>
						<Text>{opt.pt}</Text>
					</TouchableOpacity>
				));

			case "grupo":
				if (!("opcoes" in currentQuestion) || !currentQuestion.opcoes)
					return null;

				const groupValues = answers[questionKeys[currentIndex]] || {};
				return currentQuestion.opcoes.map((opt: Option) => (
					<TextInput
						key={opt.pt}
						style={styles.input}
						placeholder={opt.pt}
						value={groupValues[opt.pt] || ""}
						onChangeText={(val) =>
							handleAnswerChange({
								...groupValues,
								[opt.pt]: val,
							})
						}
					/>
				));

			default:
				return null;
		}
	};

	return (
		<Modal visible={visible} animationType="slide">
			<View style={styles.container}>
				{!started ? (
					<View style={styles.center}>
						<Text style={styles.title}>Ficha de Cuidados</Text>
						<Button
							title="Iniciar"
							onPress={() => setStarted(true)}
						/>
						<Button
							title="Fechar"
							onPress={onClose}
							color={colors.danger}
						/>
					</View>
				) : (
					<ScrollView contentContainerStyle={styles.scroll}>
						<Text style={styles.question}>
							{currentQuestion.pergunta_pt}
						</Text>
						{renderQuestionInput()}

						<View style={styles.navigation}>
							<Button
								title="Cancelar"
								color={colors.danger}
								onPress={handleCancel}
							/>

							{currentIndex > 0 && (
								<Button title="Anterior" onPress={handlePrev} />
							)}

							{currentIndex + 1 < questionKeys.length ? (
								<Button title="Próximo" onPress={handleNext} />
							) : (
								<Button title="Salvar" onPress={handleSave} />
							)}
						</View>
					</ScrollView>
				)}
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 20, backgroundColor: colors.background },
	center: { flex: 1, justifyContent: "center", alignItems: "center" },
	title: { fontSize: 22, fontWeight: "600", marginBottom: 20 },
	scroll: {
		paddingBottom: 40,
		position: "absolute",
		bottom: 0,
		width: "100%",
	},
	question: { fontSize: 16, fontWeight: "600", marginBottom: 12 },
	input: {
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 10,
		padding: 12,
		marginBottom: 14,
		backgroundColor: colors.white,
		fontSize: 15,
	},
	optionButton: {
		padding: 12,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 10,
		marginBottom: 10,
		backgroundColor: colors.white,
	},
	optionSelected: {
		backgroundColor: colors.primary,
	},
	navigation: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 20,
	},
});
