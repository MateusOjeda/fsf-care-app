import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function ControlScreen() {
	const router = useRouter();

	return (
		<View
			style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
		>
			<Text>Página de Controle</Text>
		</View>
	);
}
