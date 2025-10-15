import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";
import LogoutButton from "@/src/components/LogoutButton";
import { AuthContext } from "@/src/context/AuthContext";
import { useContext } from "react";
import Avatar from "@/src/components/Avatar";

export default function HomeComponent() {
	const router = useRouter();
	const { user } = useContext(AuthContext);

	return (
		<View
			style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
		>
			<Text>Bem-vindo {user?.profile?.name || ""}!</Text>
			<Avatar photoURL={user?.photoURL} size={80} />
			<Text>Seu e-mail: {user?.email}</Text>
			<Text>Função: {user?.role}</Text>
			{user?.expiresAt instanceof Date && (
				<Text>
					Conta expira em:{" "}
					{user?.expiresAt.toLocaleDateString("pt-BR", {
						day: "numeric",
						month: "long",
						year: "numeric",
					})}
				</Text>
			)}
			<Button
				title="Editar perfil"
				onPress={() => router.push("/profile")}
			/>
			<LogoutButton />
		</View>
	);
}
