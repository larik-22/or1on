import {derived, readable, writable} from "svelte/store";
import {jwtDecode, type JwtPayload} from "jwt-decode";

const authToken = writable(localStorage.getItem('token') || null);

interface ExtendedJwtPayload extends JwtPayload {
	isAdmin?: boolean;
}

const isUserAdmin = derived(authToken, ($token) => {
	if ($token) {
		//TODO decode in try and catch block;
		const decoded = jwtDecode<ExtendedJwtPayload>($token);
		return decoded.isAdmin;
	}

	return false;
});

export {authToken, isUserAdmin};