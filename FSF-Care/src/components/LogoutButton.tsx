import { Button, Alert } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "expo-router";
import ButtonPrimary from "@/src/components/ButtonPrimary";

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

	return (
		<ButtonPrimary
			title="Sair"
			onPress={handleLogout}
			color="#D64545"
		></ButtonPrimary>
	);
}
