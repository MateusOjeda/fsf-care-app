import { Slot, useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { AuthProvider, AuthContext } from "../context/AuthContext";
import { View, ActivityIndicator } from "react-native";

function RootStack() {
	const { user, loading, logout } = useContext(AuthContext);
	const router = useRouter();

	useEffect(() => {
		if (loading) return;

		if (!user) {
			router.replace("/auth/login");
		} else {
			switch (user.role) {
				case "admin":
					router.replace("/tabs/admin/home");
					break;
				case "medico":
					router.replace("/tabs/medico/home");
					break;
				case "psicossocial":
					router.replace("/tabs/psicossocial/home");
					break;
				case "geral":
					router.replace("/tabs/geral/home");
					break;
				case "no_profile":
					router.replace("/no_profile");
					break;
				default:
					logout();
					router.replace("/auth/login");
			}
		}
	}, [user, loading]);

	// Apenas enquanto estiver carregando o AsyncStorage
	if (loading) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	return <Slot />;
}

export default function RootLayout() {
	return (
		<AuthProvider>
			<RootStack />
		</AuthProvider>
	);
}
