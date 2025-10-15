import PatientDetails from "@/src/ui/patients/PatientDetails";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PatientsDetailsScreen() {
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<PatientDetails />
		</SafeAreaView>
	);
}
