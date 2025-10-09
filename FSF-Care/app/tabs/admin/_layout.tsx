import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import RoleGuard from "~components/RoleGuard";

export default function TabsLayout() {
	return (
		<RoleGuard allowedRoles={["admin"]}>
			<Tabs
				screenOptions={{
					headerShown: false,
				}}
			>
				<Tabs.Screen
					name="home"
					options={{
						title: "Home",
						tabBarIcon: ({ color, size }) => (
							<Ionicons name="home" color={color} size={size} />
						),
					}}
				/>
				<Tabs.Screen
					name="patients/index"
					options={{
						title: "Patients",
						tabBarIcon: ({ color, size }) => (
							<Ionicons
								name="person-sharp"
								color={color}
								size={size}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name="control/index"
					options={{
						title: "Control Page",
						tabBarIcon: ({ color, size }) => (
							<Ionicons
								name="settings-sharp"
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
