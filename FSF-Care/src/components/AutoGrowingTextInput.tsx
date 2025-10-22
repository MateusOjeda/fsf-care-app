// src/components/AutoGrowingTextInput.tsx
import React, { useState } from "react";
import { TextInput, StyleSheet, TextInputProps } from "react-native";
import colors from "@/src/theme/colors";

interface AutoGrowingTextInputProps extends TextInputProps {
	minHeight?: number;
}

export default function AutoGrowingTextInput({
	style,
	minHeight = 60,
	...props
}: AutoGrowingTextInputProps) {
	const [height, setHeight] = useState(minHeight);

	return (
		<TextInput
			{...props}
			style={[
				styles.input,
				style,
				{ height: Math.max(minHeight, height) },
			]}
			multiline
			onContentSizeChange={(e) =>
				setHeight(e.nativeEvent.contentSize.height + 10)
			}
		/>
	);
}

const styles = StyleSheet.create({
	input: {
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 10,
		padding: 12,
		backgroundColor: colors.white,
		color: colors.textPrimary,
		marginBottom: 14,
		fontSize: 15,
		textAlignVertical: "top",
	},
});
