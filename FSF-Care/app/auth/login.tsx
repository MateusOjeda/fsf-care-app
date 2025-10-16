import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	Image,
	KeyboardAvoidingView,
	Platform,
	Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/hooks/useAuth";
import ButtonPrimary from "@/src/components/ButtonPrimary";
import colors from "@/src/theme/colors";

export default function LoginScreen() {
	const router = useRouter();
	const { login } = useAuth();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async () => {
		if (!email || !password) {
			Alert.alert("Oops", "Por favor, preencha e-mail e senha.");
			return;
		}

		setLoading(true);
		try {
			await login(email, password);
		} finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : undefined}
				style={styles.container}
			>
				<View style={styles.content}>
					<Image
						source={require("../../assets/images/logo-big-fsf.png")}
						style={styles.logo}
						resizeMode="contain"
					/>

					<Image
						source={require("../../assets/images/venha-viver-a-fraternidade.png")}
						style={styles.message}
						resizeMode="contain"
					/>

					{/* Formulário */}
					<View style={styles.form}>
						<TextInput
							style={styles.input}
							placeholder="E-mail"
							keyboardType="email-address"
							autoCapitalize="none"
							placeholderTextColor="#7a7a7a"
							value={email}
							onChangeText={setEmail}
						/>
						<TextInput
							style={styles.input}
							placeholder="Senha"
							secureTextEntry
							placeholderTextColor="#7a7a7a"
							value={password}
							onChangeText={setPassword}
						/>

						<ButtonPrimary
							title="Entrar"
							onPress={handleSubmit}
							loading={loading}
						/>

						<TouchableOpacity
							style={{ marginTop: 20 }}
							onPress={() => router.push("/auth/register")}
						>
							<Text style={styles.linkText}>
								Não tem uma conta?{" "}
								<Text style={styles.linkStrong}>Registrar</Text>
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
		backgroundColor: colors.white,
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
});
