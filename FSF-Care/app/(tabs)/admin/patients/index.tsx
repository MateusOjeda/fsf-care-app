import PatientsComponent from "@/src/ui/patients/Patients";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PatientsScreen() {
	const insets = useSafeAreaInsets();
	return (
		<SafeAreaView
			style={{
				flex: 1,
				paddingBottom: -insets.bottom,
			}}
		>
			<PatientsComponent />
		</SafeAreaView>
	);
}
