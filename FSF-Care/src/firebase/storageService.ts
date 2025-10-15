import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/src/firebase/_config";

/**
 * Faz upload de uma imagem e retorna a URL pública.
 * @param uri Caminho local da imagem (do ImagePicker, por exemplo)
 * @param path Caminho no storage (ex: "users/{uid}.jpg")
 */
export async function uploadImageAsync(
	uri: string,
	path: string
): Promise<string> {
	const response = await fetch(uri);
	const blob = await response.blob();
	const storageRef = ref(storage, path);
	await uploadBytes(storageRef, blob);
	return await getDownloadURL(storageRef);
}
