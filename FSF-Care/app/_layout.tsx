import { Slot, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { AuthProvider, AuthContext } from "../src/context/AuthContext";
import LogRouteExpo from "@/src/components/LogRouteExpo";

function RootStack() {
	const [mounted, setMounted] = useState(false);
	const { user, loading, logout } = useContext(AuthContext);
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
		} else {
			switch (user.role) {
				case "admin":
					router.replace("/tabs/admin/home");
					break;
				// case "medico":
				// 	router.replace("/tabs/medico/home");
				// 	break;
				// case "psicossocial":
				// 	router.replace("/tabs/psicossocial/home");
				// 	break;
				// case "geral":
				// 	router.replace("/tabs/geral/home");
				// 	break;
				default:
					router.replace("/auth/access-code");
			}
		}
	}, [user, loading]);

	return <Slot />;
}

export default function RootLayout() {
	return (
		<AuthProvider>
			<RootStack />
			<LogRouteExpo />
		</AuthProvider>
	);
}
