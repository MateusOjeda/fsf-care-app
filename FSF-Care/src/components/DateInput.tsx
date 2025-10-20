import React, { useState } from "react";
import {
	TouchableOpacity,
	Text,
	ViewStyle,
	TextStyle,
	StyleSheet,
	Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import colors from "@/src/theme/colors";

type DateInputProps = {
	value?: Date | null;
	onChange: (date: Date | null) => void;
	placeholder?: string;
	style?: ViewStyle;
	textStyle?: TextStyle;
	maximumDate?: Date;
	minimumDate?: Date;
	mode?: "date" | "time" | "datetime";
	editable?: boolean;
	formatString?: string; // formato para exibir
};

export default function DateInput({
	value,
	onChange,
	placeholder = "Selecionar data",
	style,
	textStyle,
	maximumDate,
	minimumDate = new Date(1900, 0, 1),
	mode = "date",
	editable = true,
	formatString = "dd/MM/yyyy",
}: DateInputProps) {
	const [showPicker, setShowPicker] = useState(false);

	const handleChange = (_: any, selected?: Date) => {
		if (Platform.OS !== "ios") setShowPicker(false);
		if (selected) {
			onChange(selected);
		}
	};

	return (
		<>
			<TouchableOpacity
				activeOpacity={editable ? 0.7 : 1}
				style={[styles.input, style, !editable && { opacity: 0.6 }]}
				onPress={() => editable && setShowPicker(true)}
			>
				<Text
					style={[
						styles.text,
						textStyle,
						{
							color: value
								? colors.textPrimary
								: colors.textSecondary,
						},
					]}
				>
					{value ? format(value, formatString) : placeholder}
				</Text>
			</TouchableOpacity>

			{showPicker && (
				<DateTimePicker
					value={value || new Date()}
					mode={mode}
					display={Platform.OS === "ios" ? "spinner" : "default"}
					onChange={handleChange}
					maximumDate={maximumDate}
					minimumDate={minimumDate}
				/>
			)}
		</>
	);
}

const styles = StyleSheet.create({
	input: {
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 10,
		paddingVertical: 12,
		paddingHorizontal: 12,
		backgroundColor: colors.white,
	},
	text: {
		fontSize: 15,
	},
});
