// src/hooks/useAccessCode.ts
import { useState, useContext } from "react";
import { Alert } from "react-native";
import {
	collection,
	query,
	where,
	getDocs,
	updateDoc,
	doc,
	Timestamp,
} from "firebase/firestore";
import { db } from "@/src/firebase/config";
import { AuthContext } from "@/src/context/AuthContext";
import { User } from "@/src/types";

export function useAccessCode() {
	const [loading, setLoading] = useState(false);
	const { user, login } = useContext(AuthContext);

	const validateAccessCode = async (code: string) => {
		if (!user) {
			Alert.alert("Erro", "Usuário não autenticado");
			return;
		}
		if (!code) {
			Alert.alert("Erro", "Digite o código de acesso");
			return;
		}

		setLoading(true);

		try {
			const q = query(
				collection(db, "accessCodes"),
				where("code", "==", code)
			);
			const snapshot = await getDocs(q);

			if (snapshot.empty) throw new Error("Código inválido");

			const accessDoc = snapshot.docs[0];
			const accessData = accessDoc.data();

			if (
				accessData.expiresAt &&
				accessData.expiresAt.toDate() < new Date()
			) {
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

			// define validade do usuário
			const userExpireAt = undefined;
			if (
				typeof accessData.durationDays === "number" &&
				!isNaN(accessData.durationDays)
			) {
				const userExpireAt = new Date();
				userExpireAt.setDate(
					userExpireAt.getDate() + accessData.durationDays
				);
			}

			// atualiza o usuário no Firestore
			const userRef = doc(db, "users", user.uid);
			const updatedUser: User = {
				...user,
				role: accessData.role,
				active: true,
			};

			await updateDoc(userRef, {
				...updatedUser,
				...(userExpireAt
					? { expiresAt: Timestamp.fromDate(userExpireAt) }
					: {}),
			});

			// atualiza o código
			await updateDoc(accessDoc.ref, {
				usedBy: [...accessData.usedBy, user.uid],
			});

			await login(updatedUser);

			return true;
		} catch (error: any) {
			console.error("Erro validando access code:", error);
			Alert.alert("Erro", error.message);
			return false;
		} finally {
			setLoading(false);
		}
	};

	return { validateAccessCode, loading };
}
