import { Text } from "react-native";
import { useRouter } from "expo-router";
import GenerateAccessCode from "@/src/components/GenerateAccessCode";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RoleGuard from "@/src/components/guards/RoleGuard";

export default function ControlScreen() {
	const insets = useSafeAreaInsets();
	const router = useRouter();

	return (
		<RoleGuard allowedRoles={["admin"]}>
			<SafeAreaView
				style={{
					flex: 1,
					paddingBottom: -insets.bottom,
				}}
			>
				<Text>Página de Controle</Text>

				<GenerateAccessCode />
			</SafeAreaView>
		</RoleGuard>
	);
}
