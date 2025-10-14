import { Text } from "react-native";
import { useRouter } from "expo-router";
import GenerateAccessCode from "@/src/components/GenerateAccessCode";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ControlScreen() {
	const router = useRouter();

	return (
		<SafeAreaView
			style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
		>
			<Text>Página de Controle</Text>

			<GenerateAccessCode />
		</SafeAreaView>
	);
}
