import { Slot, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { AuthProvider, AuthContext } from "../src/context/AuthContext";
import LogRouteExpo from "@/src/utils/LogRouteExpo";
import { StatusBar } from "react-native";
import { FocusSearchProvider } from "@/src/context/FocusSearchContext";

function RootStack() {
	const [mounted, setMounted] = useState(false);
	const { user, loading } = useContext(AuthContext);
	const router = useRouter();

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!mounted) return;

		if (loading) {
			router.replace("/loading");
			return;
		}

		if (!user) {
			router.replace("/auth/login");
		} else if (
			!user.active ||
			(user.expiresAt && new Date(user.expiresAt) < new Date())
		) {
			router.replace("/auth/access-code");
		} else if (user.role) {
			router.replace("/home");
		} else {
			router.replace("/auth/access-code");
		}
	}, [user, loading]);

	return <Slot />;
}

export default function RootLayout() {
	return (
		<AuthProvider>
			<FocusSearchProvider>
				<StatusBar
					barStyle="dark-content" // ícones escuros (hora, wifi, bateria)
					backgroundColor="#F2F2F2" // cor de fundo da barra
				/>
				<RootStack />
				<LogRouteExpo />
			</FocusSearchProvider>
		</AuthProvider>
	);
}
