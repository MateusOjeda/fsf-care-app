import { Button, Alert } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "expo-router";

export default function LogoutButton() {
	const { logout } = useContext(AuthContext);
	const router = useRouter();

	const handleLogout = async () => {
		Alert.alert(
			"Confirmação",
			"Deseja realmente sair?",
			[
				{ text: "Cancelar", style: "cancel" },
				{
					text: "Sair",
					style: "destructive",
					onPress: async () => {
						await logout();
					},
				},
			],
			{ cancelable: true }
		);
	};

	return <Button title="Logout" onPress={handleLogout} />;
}
