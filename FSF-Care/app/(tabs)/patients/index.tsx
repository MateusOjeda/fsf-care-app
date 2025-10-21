import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useEffect, useState, useContext, useRef } from "react";
import {
	View,
	Text,
	TextInput,
	FlatList,
	TouchableOpacity,
	ActivityIndicator,
	StyleSheet,
} from "react-native";
import { fetchPatients } from "@/src/firebase/patientService";
import { Patient } from "@/src/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import Avatar from "@/src/components/Avatar";
import ButtonPrimary from "@/src/components/ButtonPrimary";
import PatientRow from "@/src/components/PatientRow";
import colors from "@/src/theme/colors";
import { AuthContext } from "@/src/context/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import { useFocusSearch } from "@/src/context/FocusSearchContext";

export default function PatientsScreen() {
	const insets = useSafeAreaInsets();

	const { user } = useContext(AuthContext);
	const { initialFilter } = useLocalSearchParams<{
		initialFilter?: "all" | "mine";
	}>();

	const [patients, setPatients] = useState<{ id: string; data: Patient }[]>(
		[]
	);
	const [filtered, setFiltered] = useState<{ id: string; data: Patient }[]>(
		[]
	);
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState<"all" | "mine">("all");

	const [loading, setLoading] = useState(true);
	const router = useRouter();

	// Para setar o focus no input de busca quando necessário
	const { shouldFocusSearch, setShouldFocusSearch } = useFocusSearch();
	const searchInputRef = useRef<TextInput>(null);
	useFocusEffect(
		React.useCallback(() => {
			if (shouldFocusSearch) {
				console.log("Focando no input de busca...");
				const timer = setTimeout(() => {
					searchInputRef.current?.focus();
					setShouldFocusSearch(false);
				}, 300);
				return () => clearTimeout(timer);
			}
		}, [shouldFocusSearch])
	);

	useEffect(() => {
		const fetch = async () => {
			setLoading(true);
			try {
				const docs = await fetchPatients();
				setPatients(docs);
				setFiltered(docs);
			} catch (err) {
				console.error("Erro ao buscar pacientes:", err);
			} finally {
				setLoading(false);
			}
		};
		fetch();
	}, []);

	useEffect(() => {
		let list = [...patients];

		if (filter === "mine" && user) {
			list = list.filter((p) => p.data.createdBy === user.uid);
		}

		if (search.trim()) {
			const lower = search.toLowerCase();
			list = list.filter((p) =>
				p.data.name?.toLowerCase().includes(lower)
			);
		}

		setFiltered(list);
	}, [search, patients, filter]);

	useEffect(() => {
		initialFilter && setFilter(initialFilter);
	}, [initialFilter]);

	const handleAdd = () => router.push("/form/patients");

	if (loading) {
		return (
			<View style={styles.center}>
				<ActivityIndicator size="large" color={colors.primary} />
				<Text style={styles.loadingText}>Carregando pacientes...</Text>
			</View>
		);
	}

	return (
		<SafeAreaView
			style={{
				flex: 1,
				paddingBottom: -insets.bottom,
			}}
		>
			<View style={styles.container}>
				<Text style={styles.title}>Pacientes</Text>

				{/* Filtro de "Todos" / "Meus" */}
				<View style={styles.filterContainer}>
					<TouchableOpacity
						style={[
							styles.filterButton,
							filter === "all" && styles.filterActive,
						]}
						onPress={() => setFilter("all")}
					>
						<Text
							style={[
								styles.filterText,
								filter === "all" && styles.filterTextActive,
							]}
						>
							Todos
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[
							styles.filterButton,
							filter === "mine" && styles.filterActive,
						]}
						onPress={() => setFilter("mine")}
					>
						<Text
							style={[
								styles.filterText,
								filter === "mine" && styles.filterTextActive,
							]}
						>
							Meus pacientes
						</Text>
					</TouchableOpacity>
				</View>

				<TextInput
					ref={searchInputRef}
					style={styles.search}
					placeholder="Buscar por nome..."
					value={search}
					onChangeText={setSearch}
					placeholderTextColor={colors.textSecondary}
				/>

				<FlatList
					data={filtered}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<TouchableOpacity
							onPress={() => router.push(`/patients/${item.id}`)}
							activeOpacity={0.7}
						>
							<PatientRow
								photoURL={item.data.photoThumbnailURL}
								name={item.data.name}
								birthDate={item.data.birthDate}
							></PatientRow>
						</TouchableOpacity>
					)}
					refreshing={loading}
					onRefresh={async () => {
						setLoading(true);
						const docs = await fetchPatients();
						setPatients(docs);
						setLoading(false);
					}}
				/>

				<ButtonPrimary title="Adicionar Paciente" onPress={handleAdd} />
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
		paddingHorizontal: 16,
		paddingTop: 30,
		paddingBottom: 10,
	},
	title: {
		fontSize: 22,
		fontWeight: "600",
		color: colors.textPrimary,
		marginBottom: 12,
	},
	filterContainer: {
		flexDirection: "row",
		marginBottom: 12,
		backgroundColor: colors.white,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: colors.border,
		overflow: "hidden",
	},
	filterButton: {
		flex: 1,
		alignItems: "center",
		paddingVertical: 10,
	},
	filterActive: {
		backgroundColor: colors.primary,
	},
	filterText: {
		fontSize: 15,
		color: colors.textSecondary,
		fontWeight: "500",
	},
	filterTextActive: {
		color: colors.white,
	},
	search: {
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 10,
		padding: 12,
		marginBottom: 12,
		backgroundColor: colors.white,
		color: colors.textPrimary,
	},

	center: { flex: 1, justifyContent: "center", alignItems: "center" },
	loadingText: {
		marginTop: 12,
		fontSize: 16,
		color: colors.textSecondary,
		fontWeight: "500",
		textAlign: "center",
	},
});
