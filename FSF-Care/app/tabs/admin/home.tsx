import HomeComponent from "@/src/ui/home/Home";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<HomeComponent />
		</SafeAreaView>
	);
}
