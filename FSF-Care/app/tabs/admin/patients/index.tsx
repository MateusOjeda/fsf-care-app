import PatientsComponent from "@/src/ui/patients/Patients";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PatientsScreen() {
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<PatientsComponent />
		</SafeAreaView>
	);
}
