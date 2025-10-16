import AttendancesComponent from "@/src/ui/attendances/Attendances";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AttendancesScreen() {
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<AttendancesComponent />
		</SafeAreaView>
	);
}
