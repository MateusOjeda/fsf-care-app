import ProfileComponent from "@/src/ui/profile/Profile";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ProfileComponent />
		</SafeAreaView>
	);
}
