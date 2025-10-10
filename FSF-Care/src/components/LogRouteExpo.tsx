import { useEffect } from "react";
import { usePathname, useLocalSearchParams } from "expo-router";

export default function LogRouteExpo() {
	const pathname = usePathname();
	const params = useLocalSearchParams(); // { id: "abc" } para route [id].tsx

	useEffect(() => {
		console.log("Route:", pathname);
		if (params && Object.keys(params).length > 0) {
			console.log("Route params:", params);
		}
	}, [pathname, JSON.stringify(params)]);

	return <></>;
}
