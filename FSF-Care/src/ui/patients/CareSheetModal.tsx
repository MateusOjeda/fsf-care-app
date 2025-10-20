import React, { useState } from "react";
import {
	View,
	Text,
	Modal,
	StyleSheet,
	TouchableOpacity,
	TextInput,
	ScrollView,
	Alert,
} from "react-native";
import DateInput from "@/src/components/DateInput";
import ButtonPrimary from "@/src/components/ButtonPrimary";
import colors from "@/src/theme/colors";
import { Patient, CareSheetAnswers, Option } from "@/src/types";
import { getQuestionsByVersion, QuestionVersion } from "@/src/data/questions";
import { saveCareSheet } from "@/src/firebase/careSheetService";
import { SafeAreaView } from "react-native-safe-area-context";

type CareSheetModalProps = {
	visible: boolean;
	onClose: () => void;
	patient: Patient;
	version?: QuestionVersion;
	onRefresh?: () => void;
};

export default function CareSheetModal({
	visible,
	onClose,
	patient,
	version = "v1",
	onRefresh,
}: CareSheetModalProps) {
	const [started, setStarted] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [answers, setAnswers] = useState<CareSheetAnswers>({});
	const [saving, setSaving] = useState(false);

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

	const handleCancel = ({ confirmBeforeCancel = true } = {}) => {
		const handle = () => {
			setStarted(false);
			setCurrentIndex(0);
			setAnswers({});
			onClose();
			if (onRefresh) onRefresh();
		};

		if (confirmBeforeCancel) {
			Alert.alert("Tem certeza?", " Todas as respostas serão apagadas.", [
				{
					text: "Não",
					style: "cancel",
				},
				{
					text: "Sim, cancelar",
					style: "destructive",
					onPress: handle,
				},
			]);
		} else {
			handle();
		}
	};

	const handleSave = async () => {
		if (!patient) return;
		setSaving(true);
		try {
			await saveCareSheet(patient, answers, version);
			handleCancel({ confirmBeforeCancel: false });
		} catch (error) {
			console.error("Erro ao salvar CareSheet:", error);
			alert("Não foi possível salvar a ficha. Tente novamente.");
		} finally {
			setSaving(false);
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
				if (!currentQuestion.opcoes) return null;

				const selected: string[] =
					currentQuestion.tipo === "checkbox"
						? answers[questionKeys[currentIndex]] || []
						: [];

				return currentQuestion.opcoes.map((opt: Option) => {
					const isSelected =
						(currentQuestion.tipo === "multipla_escolha" &&
							answers[questionKeys[currentIndex]] === opt.pt) ||
						(currentQuestion.tipo === "checkbox" &&
							selected.includes(opt.pt));

					return (
						<TouchableOpacity
							key={opt.pt}
							style={[
								styles.optionButton,
								isSelected && styles.optionSelected,
							]}
							onPress={() => {
								if (
									currentQuestion.tipo === "multipla_escolha"
								) {
									handleAnswerChange(opt.pt);
								} else {
									if (selected.includes(opt.pt)) {
										handleAnswerChange(
											selected.filter((s) => s !== opt.pt)
										);
									} else {
										handleAnswerChange([
											...selected,
											opt.pt,
										]);
									}
								}
							}}
						>
							<Text
								style={[
									styles.optionText,
									isSelected && styles.optionTextSelected,
								]}
							>
								{opt.pt}
							</Text>
						</TouchableOpacity>
					);
				});

			case "grupo":
				if (!currentQuestion.opcoes) return null;

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
			<SafeAreaView style={{ flex: 1 }}>
				<View style={styles.container}>
					{!started ? (
						<View style={styles.center}>
							<Text style={styles.title}>Ficha de Cuidados</Text>
							<ButtonPrimary
								title="Iniciar"
								onPress={() => setStarted(true)}
								style={{ marginBottom: 10 }}
							/>
							<ButtonPrimary
								title="Fechar"
								onPress={onClose}
								style={{ backgroundColor: colors.danger }}
							/>
						</View>
					) : (
						<>
							<ScrollView
								contentContainerStyle={styles.scroll}
								keyboardShouldPersistTaps="handled"
							>
								<Text style={styles.question}>
									{currentQuestion.pergunta_pt}
								</Text>

								{renderQuestionInput()}
							</ScrollView>

							{/* Botões fixos no rodapé */}
							<View style={styles.footer}>
								<ButtonPrimary
									title="Cancelar"
									onPress={() => handleCancel()}
									style={{
										backgroundColor: colors.danger,
										flex: 1,
									}}
								/>

								<ButtonPrimary
									title="Anterior"
									onPress={handlePrev}
									style={{
										backgroundColor: colors.cardBackground,
										flex: 1,
									}}
									textStyle={{ color: colors.textPrimary }}
									disabled={currentIndex === 0}
								/>

								{currentIndex + 1 < questionKeys.length ? (
									<ButtonPrimary
										title="Próximo"
										onPress={handleNext}
										style={{ flex: 1 }}
									/>
								) : (
									<ButtonPrimary
										title={
											saving ? "Salvando..." : "Salvar"
										}
										onPress={handleSave}
										loading={saving}
										style={{ flex: 1 }}
									/>
								)}
							</View>
						</>
					)}
				</View>
			</SafeAreaView>
		</Modal>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 30,
		backgroundColor: colors.background,
	},
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		fontSize: 22,
		fontWeight: "600",
		color: colors.textPrimary,
		marginBottom: 20,
	},
	scroll: {
		paddingBottom: 120, // deixa espaço para os botões
	},
	question: {
		fontSize: 18,
		fontWeight: "600",
		color: colors.textPrimary,
		marginBottom: 16,
	},
	input: {
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 12,
		padding: 12,
		marginBottom: 16,
		backgroundColor: colors.white,
		fontSize: 15,
	},
	optionButton: {
		padding: 12,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 12,
		marginBottom: 10,
		backgroundColor: colors.white,
	},
	optionSelected: {
		backgroundColor: colors.primary,
	},
	optionText: {
		fontSize: 15,
		color: colors.textPrimary,
	},
	optionTextSelected: {
		color: colors.white,
		fontWeight: "600",
	},
	footer: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		padding: 16,
		backgroundColor: colors.background,
		borderTopWidth: 1,
		borderColor: colors.border,
		flexDirection: "row",
		gap: 8,
	},
});
