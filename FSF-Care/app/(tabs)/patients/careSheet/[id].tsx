import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import {
	ScrollView,
	View,
	StyleSheet,
	Alert,
	ActivityIndicator,
	Text,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import BackHeader from "@/src/components/BackHeader";
import colors from "@/src/theme/colors";
import { CareSheetData } from "@/src/types";
import {
	getCareSheetById,
	deleteCareSheet,
} from "@/src/firebase/careSheetService";
import { getQuestionsByVersion, QuestionVersion } from "@/src/data/questions";
import ButtonPrimary from "@/src/components/ButtonPrimary";

export default function PatientsScreen() {
	const insets = useSafeAreaInsets();

	const { id: careSheetId, patientId } = useLocalSearchParams<{
		id: string;
		patientId: string;
	}>();
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [careSheet, setCareSheet] = useState<CareSheetData | null>(null);
	const [deleting, setDeleting] = useState(false);

	useEffect(() => {
		if (!careSheetId) return;

		const fetchCareSheet = async () => {
			setLoading(true);
			try {
				const data = await getCareSheetById(careSheetId);
				if (!data) {
					Alert.alert("Erro", "Ficha não encontrada");
					router.back();
					return;
				}
				setCareSheet(data);
			} catch (err) {
				console.error(err);
				Alert.alert("Erro", "Não foi possível carregar a ficha");
			} finally {
				setLoading(false);
			}
		};

		fetchCareSheet();
	}, [careSheetId]);

	const handleDelete = async () => {
		if (!careSheet) return;
		Alert.alert(
			"Confirmar exclusão",
			"Tem certeza que deseja deletar esta ficha?",
			[
				{ text: "Cancelar", style: "cancel" },
				{
					text: "Deletar",
					style: "destructive",
					onPress: async () => {
						setDeleting(true);
						try {
							await deleteCareSheet(patientId, careSheetId);
							// Alert.alert("Sucesso", "Ficha deletada");
							router.push(`/patients/${patientId}`);
						} catch (err) {
							console.error(err);
							Alert.alert(
								"Erro",
								"Não foi possível deletar a ficha"
							);
						} finally {
							setDeleting(false);
						}
					},
				},
			]
		);
	};

	if (loading || !careSheet) {
		return (
			<View style={styles.center}>
				<ActivityIndicator size="large" color={colors.primary} />
				<Text style={styles.loadingText}>Carregando ficha...</Text>
			</View>
		);
	}

	const questionSet = getQuestionsByVersion(
		careSheet.version as QuestionVersion
	);

	return (
		<SafeAreaView
			style={{
				flex: 1,
				paddingBottom: -insets.bottom,
			}}
		>
			<View style={styles.container}>
				<BackHeader
					title="Ficha de Cuidados"
					onPress={() => router.back()}
				/>
				<ScrollView contentContainerStyle={styles.containerScroll}>
					{Object.entries(careSheet.answers).map(
						([questionId, answer]) => {
							const question = questionSet[questionId];
							const questionText =
								question?.pergunta_pt ||
								`Pergunta ${questionId}`;

							return (
								<View key={questionId} style={styles.card}>
									<Text style={styles.question}>
										{questionText}
									</Text>
									{typeof answer === "object" &&
									!Array.isArray(answer) ? (
										Object.entries(answer).map(
											([key, val]) => (
												<Text
													key={key}
													style={styles.answer}
												>
													{key}: {String(val)}
												</Text>
											)
										)
									) : Array.isArray(answer) ? (
										answer.map((val, idx) => (
											<Text
												key={idx}
												style={styles.answer}
											>
												- {String(val)}
											</Text>
										))
									) : (
										<Text style={styles.answer}>
											{String(answer)}
										</Text>
									)}
								</View>
							);
						}
					)}

					<View style={styles.buttonWrapper}>
						<ButtonPrimary
							title={deleting ? "Deletando..." : "Deletar ficha"}
							onPress={handleDelete}
							color={colors.danger}
							loading={deleting}
						/>
					</View>
				</ScrollView>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	containerScroll: {
		paddingHorizontal: 16,
		paddingTop: 20,
		paddingBottom: 20,
	},
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	center: { flex: 1, justifyContent: "center", alignItems: "center" },
	loadingText: { marginTop: 12, fontSize: 16, color: colors.textSecondary },

	card: {
		backgroundColor: colors.cardBackground,
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: colors.border,
	},
	question: { fontSize: 16, fontWeight: "600", color: colors.textPrimary },
	answer: { fontSize: 15, color: colors.textPrimary, marginTop: 4 },

	buttonWrapper: {
		marginTop: 20,
		marginBottom: 40,
	},
});
