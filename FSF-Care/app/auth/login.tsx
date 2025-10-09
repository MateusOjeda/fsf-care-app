import { View, Text, TextInput, Button } from "react-native";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useRouter } from "expo-router";

export default function LoginScreen() {
	const { login } = useContext(AuthContext);
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	console.log("Passei pela tela de login");

	const handleLogin = async () => {
		await login(email, password);
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
		</View>
	);
}
