import { View, Text, TextInput, Button, Alert } from "react-native";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { loginUser } from "~firebase/auth-firebase";
import { useRouter } from "expo-router";

export default function LoginScreen() {
	const { login } = useContext(AuthContext);
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = async () => {
		try {
			const user = await loginUser(email, password);
			await login(user);
		} catch (error: any) {
			console.log("Erro login:", error);
			Alert.alert("Erro", error.message);
		}
	};

	return (
		<View
			style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
		>
			<Text>Email</Text>
			<TextInput
				style={{ borderWidth: 1, width: 200, marginBottom: 10 }}
				value={email}
				onChangeText={setEmail}
			/>
			<Text>Senha</Text>
			<TextInput
				style={{ borderWidth: 1, width: 200, marginBottom: 20 }}
				value={password}
				onChangeText={setPassword}
				secureTextEntry
			/>
			<Button title="Login" onPress={handleLogin} />
			<Button
				title="Register"
				onPress={() => router.replace("/auth/register-screen")}
			/>
		</View>
	);
}
