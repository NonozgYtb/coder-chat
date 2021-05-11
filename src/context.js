import { createContext } from "react";
export const MainContext = createContext([
	{
		user: {
			id: undefined,
			name: undefined,
		},
		logged: false,
	},
	() => {},
]);
