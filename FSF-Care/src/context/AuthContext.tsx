import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types";

type AuthContextType = {
	user: User | null;
	loading: boolean;
	login: (user: User) => Promise<void>;
	logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
	user: null,
	loading: true,
	login: async () => {},
	logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	const login = async (user: User) => {
		setUser(user);
		await AsyncStorage.setItem("user", JSON.stringify(user));
		console.log("Login feito: ", user);
	};

	const logout = async () => {
		setUser(null);
		console.log("Logout");
		await AsyncStorage.removeItem("user");
	};

	useEffect(() => {
		const loadUser = async () => {
			try {
				const stored = await AsyncStorage.getItem("user");
				if (stored) {
					const parsed = JSON.parse(stored);
					if (
						parsed.expiresAt &&
						typeof parsed.expiresAt === "string"
					) {
						parsed.expiresAt = new Date(parsed.expiresAt);
					}
					setUser(parsed);
					console.log("Login stored: ", parsed);
				}
			} catch (err) {
				console.log("Erro ao carregar usuário:", err);
			} finally {
				setLoading(false);
			}
		};
		loadUser();
	}, []);

	return (
		<AuthContext.Provider value={{ user, loading, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
