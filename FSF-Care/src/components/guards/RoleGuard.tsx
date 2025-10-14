import { ReactNode, useContext } from "react";
import { AuthContext } from "@/src/context/AuthContext";
import { View, Text } from "react-native";
import { UserRole } from "@/src/types";

type RoleGuardProps = {
	allowedRoles: UserRole[];
	children: ReactNode;
};

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
	const { user } = useContext(AuthContext);

	if (!user) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Text>Carregando...</Text>
			</View>
		);
	}

	if (!user.role || !allowedRoles.includes(user.role)) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Text>Você não tem permissão para acessar esta tela.</Text>
			</View>
		);
	}

	return <>{children}</>;
}
