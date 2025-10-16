import ProfileComponent from "@/src/ui/profile/Profile";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileScreen() {
	const insets = useSafeAreaInsets();
	return (
		<SafeAreaView
			style={{
				flex: 1,
				paddingBottom: -insets.bottom,
			}}
		>
			<ProfileComponent />
		</SafeAreaView>
	);
}
