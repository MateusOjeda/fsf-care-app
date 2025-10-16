import PatientDetails from "@/src/ui/patients/PatientDetails";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PatientsDetailsScreen() {
	const insets = useSafeAreaInsets();
	return (
		<SafeAreaView style={{ flex: 1, paddingBottom: -insets.bottom }}>
			<PatientDetails />
		</SafeAreaView>
	);
}
