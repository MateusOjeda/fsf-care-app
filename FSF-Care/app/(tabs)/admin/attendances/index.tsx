import AttendancesComponent from "@/src/ui/attendances/Attendances";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AttendancesScreen() {
	const insets = useSafeAreaInsets();
	return (
		<SafeAreaView
			style={{
				flex: 1,
				paddingBottom: -insets.bottom,
			}}
		>
			<AttendancesComponent />
		</SafeAreaView>
	);
}
