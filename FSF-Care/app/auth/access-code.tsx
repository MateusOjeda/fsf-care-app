import React, { useState, useContext } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
	StyleSheet,
	Image,
	KeyboardAvoidingView,
	Platform,
	Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "@/src/context/AuthContext";
import { useRouter } from "expo-router";
import BackHeader from "@/src/components/BackHeader";
import LogoutButton from "@/src/components/LogoutButton";
import GenerateAccessCode from "@/src/components/GenerateAccessCode";
import { useAccessCode } from "@/src/hooks/useAccessCode";
import ButtonPrimary from "@/src/components/ButtonPrimary";

export default function AccessCodeScreen() {
	const [code, setCode] = useState("");
	const { user } = useContext(AuthContext);
	const { validateAccessCode, loading } = useAccessCode();
	const router = useRouter();

	if (!user) {
		return (
			<View style={styles.container}>
				<Text>Usuário não encontrado. Faça login novamente.</Text>
			</View>
		);
	}

	const handleValidate = async () => {
		if (!code) {
			Alert.alert("Aviso", "Digite seu código de acesso");
			return;
		}

		const success = await validateAccessCode(code);
		if (success) {
			Alert.alert(
				"Sucesso",
				"Código válido! Bem-vindo ao grupo de voluntários."
			);
		} else {
			Alert.alert("Erro", "Código inválido. Tente novamente.");
		}
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<BackHeader title="Código de Acesso" showBorder />

			{/* Componentes para teste */}
			{/* <GenerateAccessCode />
			<LogoutButton /> */}

			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : undefined}
				style={styles.container}
			>
				<View style={styles.content}>
					{/* Logo FSF versão extensa */}
					<Image
						source={require("../../assets/images/fsf-extensively.png")}
						style={styles.logo}
						resizeMode="contain"
					/>

					{/* Mensagem de boas-vindas / instrução */}
					<Text style={styles.message}>
						Solicite o código ao seu coordenador. {"\n"}
						Ele garante acesso à área de voluntários da Fraternidade
						Sem Fronteiras.
					</Text>

					{/* Input de código */}
					<TextInput
						style={styles.input}
						placeholder="Código"
						value={code}
						onChangeText={setCode}
						autoCapitalize="characters"
					/>

					<ButtonPrimary
						title="Validar"
						onPress={handleValidate}
						loading={loading}
					/>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: "#F6F4EE",
	},
	container: {
		flex: 1,
		paddingHorizontal: 24,
	},
	content: {
		flex: 1,
		justifyContent: "flex-start", // conteúdo começa abaixo do header
		alignItems: "center",
		marginTop: 20,
	},
	logo: {
		width: 250,
		height: 90,
		marginBottom: 20,
	},
	message: {
		textAlign: "center",
		fontSize: 15,
		color: "#2F3E46",
		lineHeight: 22,
		marginBottom: 20,
	},
	input: {
		width: "100%",
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: "#d3d3d3",
		borderRadius: 10,
		padding: 14,
		fontSize: 16,
		color: "#333",
		marginBottom: 15,
	},
	button: {
		backgroundColor: "#3D8361",
		paddingVertical: 14,
		borderRadius: 10,
		alignItems: "center",
		marginBottom: 20,
		width: "100%",
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 4,
		elevation: 3,
	},
	buttonText: {
		color: "#fff",
		fontSize: 17,
		fontWeight: "600",
	},
});
