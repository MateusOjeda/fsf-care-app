import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import RoleGuard from "@/src/components/guards/RoleGuard";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
	const insets = useSafeAreaInsets();

	return (
		<RoleGuard allowedRoles={["admin"]}>
			<Tabs
				screenOptions={{
					headerShown: false,
					tabBarActiveTintColor: "#3D8361",
					tabBarInactiveTintColor: "#52796F",
					tabBarShowLabel: true,
					tabBarStyle: {
						backgroundColor: "#FFFFFF", // barra com cor própria
						borderTopWidth: 0.5,
						borderTopColor: "#D3D3D3",
						height: 70 + insets.bottom, // ajusta altura incluindo safe area
						paddingBottom: 10 + insets.bottom, // garante espaço seguro
						paddingTop: 10,
						borderTopLeftRadius: 20,
						borderTopRightRadius: 20,
						position: "absolute",
						left: 0,
						right: 0,
						bottom: 0,
						elevation: 5,
						shadowColor: "#000",
						shadowOffset: { width: 0, height: -2 },
						shadowOpacity: 0.05,
						shadowRadius: 10,
					},
					tabBarLabelStyle: {
						fontSize: 12,
						fontWeight: "500",
					},
				}}
			>
				<Tabs.Screen
					name="home"
					options={{
						title: "Home",
						tabBarIcon: ({ color, size, focused }) => (
							<Ionicons
								name={focused ? "home-sharp" : "home-outline"}
								color={color}
								size={size}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name="patients"
					options={{
						title: "Pacientes",
						tabBarIcon: ({ color, size, focused }) => (
							<Ionicons
								name={
									focused ? "people-sharp" : "people-outline"
								}
								color={color}
								size={size}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name="attendances"
					options={{
						title: "Atendimentos",
						tabBarIcon: ({ color, size, focused }) => (
							<Ionicons
								name={
									focused
										? "document-text-sharp"
										: "document-text-outline"
								}
								color={color}
								size={size}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name="profile"
					options={{
						title: "Perfil",
						tabBarIcon: ({ color, size, focused }) => (
							<Ionicons
								name={
									focused
										? "person-circle-sharp"
										: "person-circle-outline"
								}
								color={color}
								size={size}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name="control/index"
					options={{
						title: "Controle",
						tabBarIcon: ({ color, size, focused }) => (
							<Ionicons
								name={
									focused
										? "settings-sharp"
										: "settings-outline"
								}
								color={color}
								size={size}
							/>
						),
					}}
				/>
			</Tabs>
		</RoleGuard>
	);
}
