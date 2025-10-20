import React, { useState, useContext } from "react";
import {
	Text,
	TextInput,
	TouchableOpacity,
	Alert,
	StyleSheet,
	View,
	Image,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { AuthContext } from "@/src/context/AuthContext";
import { registerUser } from "@/src/firebase/auth";
import BackHeader from "@/src/components/BackHeader";
import ButtonPrimary from "@/src/components/ButtonPrimary";
import colors from "@/src/theme/colors";

export default function RegisterScreen() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const { login } = useContext(AuthContext);

	const handleRegister = async () => {
		if (!email || !password) {
			Alert.alert("Oops", "Por favor, preencha e-mail e senha.");
			return;
		}

		setLoading(true);
		try {
			const newUser = await registerUser(email, password);
			await login(newUser);
			router.push("/auth/access-code");
		} catch (error: any) {
			let message = "Algo deu errado. Tente novamente.";
			if (error.code === "auth/email-already-in-use")
				message = "Este e-mail já está em uso.";
			else if (error.code === "auth/invalid-email")
				message = "E-mail inválido.";
			else if (error.code === "auth/weak-password")
				message = "A senha precisa ser mais forte.";

			Alert.alert("Erro no registro", message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<BackHeader
				title="Criar conta"
				onPress={() => router.replace(`/auth/login`)}
			/>

			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : undefined}
				style={styles.container}
			>
				<View style={styles.content}>
					<Image
						source={require("@/assets/images/logo-big-fsf.png")}
						style={styles.logo}
						resizeMode="contain"
					/>

					<Text style={styles.welcomeMessage}>
						Seja bem-vindo à{"\n"}
						<Text style={{ fontWeight: "700" }}>
							Fraternidade Sem Fronteiras
						</Text>
						!{"\n"}Junte-se ao nosso grupo de voluntários e
						transforme vidas com cuidado e empatia.
					</Text>

					{/* Formulário */}
					<View style={styles.form}>
						<Text style={styles.inputLabel}>
							Insira seu e-mail:
						</Text>
						<TextInput
							style={styles.input}
							placeholder="E-mail"
							keyboardType="email-address"
							autoCapitalize="none"
							placeholderTextColor="#7a7a7a"
							value={email}
							onChangeText={setEmail}
						/>
						<Text style={styles.inputLabel}>Defina uma senha:</Text>
						<TextInput
							style={styles.input}
							placeholder="Senha"
							secureTextEntry
							placeholderTextColor="#7a7a7a"
							value={password}
							onChangeText={setPassword}
						/>

						<ButtonPrimary
							title="Registrar"
							onPress={handleRegister}
							loading={loading}
						/>

						<TouchableOpacity
							style={{ marginTop: 20 }}
							onPress={() => router.push("/auth/login")}
						>
							<Text style={styles.linkText}>
								Já tem uma conta?{" "}
								<Text style={styles.linkStrong}>Entrar</Text>
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: colors.background,
	},
	container: {
		flex: 1,
		paddingHorizontal: 24,
	},
	content: {
		flex: 1,
		alignItems: "center",
	},
	logo: {
		width: 150,
		height: 150,
		marginTop: 20,
		marginBottom: 10,
	},
	message: {
		width: 300,
		height: 34,
		marginBottom: 30,
	},
	form: {
		width: "100%",
		gap: 15,
		marginTop: 10,
	},
	input: {
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 10,
		padding: 14,
		fontSize: 16,
		color: "#333",
	},
	linkText: {
		textAlign: "center",
		color: colors.textSecondary,
		fontSize: 15,
	},
	linkStrong: {
		color: colors.primary,
		fontWeight: "600",
	},
	welcomeMessage: {
		textAlign: "center",
		fontSize: 16,
		color: colors.textPrimary,
		lineHeight: 22,
	},
	inputLabel: {
		fontSize: 15,
		color: colors.textSecondary,
		marginBottom: 4,
		marginLeft: 2,
	},
});
