import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types";

type AuthContextType = {
	user: User | null;
	loading: boolean;
	login: (email: string, password: string) => Promise<void>;
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

	const mockUserOptions = (email: string) => {
		switch (email) {
			case "admin":
				return {
					id: "124",
					name: "Admin FSF",
					role: "admin",
					active: true,
				} as User;
			case "medico":
				return {
					id: "125",
					name: "Medico FSF",
					role: "medico",
					active: true,
				} as User;
			case "psicossocial":
				return {
					id: "126",
					name: "Psicossocial FSF",
					role: "psicossocial",
					active: true,
				} as User;
			case "geral":
				return {
					id: "127",
					name: "Geral FSF",
					role: "geral",
					active: true,
				} as User;
			default:
				return {
					id: "123",
					name: "Sem Perfil",
					role: "no_profile",
					active: true,
				} as User;
		}
	};

	const login = async (email: string, password: string) => {
		// Mock login: substituir pela chamada real ao Firebase Auth
		const mockUser = mockUserOptions(email);

		setUser(mockUser);
		await AsyncStorage.setItem("user", JSON.stringify(mockUser));
		console.log("Login feito: ", mockUser);
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
				if (stored) setUser(JSON.parse(stored));
				if (stored) console.log("Login stored: ", stored);
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
