import React, { createContext, useContext, useState } from "react";

const FocusSearchContext = createContext({
	shouldFocusSearch: false,
	setShouldFocusSearch: (value: boolean) => {},
});

export function FocusSearchProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [shouldFocusSearch, setShouldFocusSearch] = useState(false);

	return (
		<FocusSearchContext.Provider
			value={{ shouldFocusSearch, setShouldFocusSearch }}
		>
			{children}
		</FocusSearchContext.Provider>
	);
}

export const useFocusSearch = () => useContext(FocusSearchContext);
