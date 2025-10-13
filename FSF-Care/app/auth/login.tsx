import { Text, TextInput, Button } from "react-native";
import { useState } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
	const { login } = useAuth();
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async () => {
		const success = await login(email, password);
	};

	return (
		<SafeAreaView
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
			<Button title="Login" onPress={handleSubmit} />
			<Button
				title="Register"
				onPress={() => router.replace("/auth/register")}
			/>
		</SafeAreaView>
	);
}
