import { useContext } from "react";
import { AuthContext } from "@/src/context/AuthContext";
import { loginUser } from "@/src/firebase/auth";
import { Alert } from "react-native";

export function useAuth() {
	const { login, logout, user } = useContext(AuthContext);

	const handleLogin = async (email: string, password: string) => {
		try {
			const userData = await loginUser(email, password);
			await login(userData);
			return true;
		} catch (error: any) {
			console.log("Erro login:", error);
			Alert.alert("Erro", error.message);
			return false;
		}
	};

	return {
		user,
		login: handleLogin,
		logout,
	};
}
