// src/hooks/useAccessCode.ts
import { useState, useContext } from "react";
import { Alert } from "react-native";
import { AuthContext } from "@/src/context/AuthContext";
import { User, AccessCode } from "@/src/types";
import * as accessCodeService from "@/src/firebase/accessCode";

export function useAccessCode() {
	const [loading, setLoading] = useState(false);
	const { user, login } = useContext(AuthContext);

	const validateAccessCode = async (code: string) => {
		if (!user) return Alert.alert("Erro", "Usuário não autenticado");
		if (!code) return Alert.alert("Erro", "Digite o código de acesso");

		setLoading(true);
		try {
			const accessDoc = await accessCodeService.fetchAccessCode(code);
			if (!accessDoc) throw new Error("Código inválido");

			const accessData = accessDoc.data;

			if (accessData.expiresAt && accessData.expiresAt < new Date()) {
				throw new Error("Este código expirou");
			}

			if (
				accessData.maxUses &&
				accessData.usedBy.length >= accessData.maxUses
			) {
				throw new Error("Código atingiu o limite de usos");
			}

			if (accessData.usedBy.includes(user.uid)) {
				throw new Error("Você já usou este código");
			}

			let expiresAt: Date | undefined;
			if (accessData.durationDays) {
				expiresAt = new Date();
				expiresAt.setDate(
					expiresAt.getDate() + accessData.durationDays
				);
			}

			await accessCodeService.updateUserAccess({
				user,
				role: accessData.role,
				expiresAt,
				active: true,
			});
			await accessCodeService.markAccessCodeUsed(accessDoc, user.uid);

			await login({
				...user,
				role: accessData.role,
				active: true,
				expiresAt,
			});

			return true;
		} catch (error: any) {
			Alert.alert("Erro", error.message);
			return false;
		} finally {
			setLoading(false);
		}
	};

	const generateRandomCode = () => {
		const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		return Array.from(
			{ length: 6 },
			() => chars[Math.floor(Math.random() * chars.length)]
		).join("");
	};

	const generateAccessCode = async (accessCode: Omit<AccessCode, "code">) => {
		setLoading(true);
		try {
			const code = generateRandomCode();
			await accessCodeService.createAccessCode({ ...accessCode, code });
			Alert.alert("Sucesso", `Código gerado: ${code}`);
			return true;
		} catch (error: any) {
			Alert.alert("Erro", error.message);
			return false;
		} finally {
			setLoading(false);
		}
	};

	return { validateAccessCode, generateAccessCode, loading };
}
