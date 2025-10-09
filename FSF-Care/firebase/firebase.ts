import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "SUA_API_KEY",
	authDomain: "SEU_AUTH_DOMAIN",
	projectId: "SEU_PROJECT_ID",
	storageBucket: "SEU_STORAGE_BUCKET",
	messagingSenderId: "SEU_MSG_ID",
	appId: "SEU_APP_ID",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Habilita cache offline
enableIndexedDbPersistence(db).catch((err) => {
	console.log("Offline persistence não disponível:", err);
});
