import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";
import LogoutButton from "~components/LogoutButton";

export default function HomeComponent() {
	const router = useRouter();

	return (
		<View
			style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
		>
			{/* <Button
				title="Abrir paciente 123"
				onPress={() => router.push("/patients/123")}
			/> */}
			<LogoutButton />
		</View>
	);
}
