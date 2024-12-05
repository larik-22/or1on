import {derived, readable, writable} from "svelte/store";
import {InvalidTokenError, jwtDecode, type JwtPayload} from "jwt-decode";
import {logout} from "../utils/authHandler.svelte";

const authToken = writable(localStorage.getItem('token') || null);

interface ExtendedJwtPayload extends JwtPayload {
	isAdmin?: boolean;
	id: string;
}

/**
 * Decodes the token and returns the payload.
 * If the token is invalid, logs the user out and throws an error.
 * @param token - The token to decode
 */
const decodeToken = (token: string | null) => {
	if (!token) {
		return null;
	}
	try {
		return jwtDecode<ExtendedJwtPayload>(token);
	} catch (e) {
		logout();
		throw new InvalidTokenError((e as Error).message);
	}
}

/**
 * Checks if the user is an admin by checking the token payload.
 */
const isUserAdmin = derived(authToken, ($token) => {
	if ($token) {
		try {
			const payload = decodeToken($token);
			return payload?.isAdmin || false;
		} catch (e) {
			return false;
		}
	} else {
		return false;
	}
});

/**
 * Checks if the user is logged in by checking if the token is valid.
 */
const isUserLoggedIn = derived(authToken, ($token) => {
	if ($token) {
		try {
			decodeToken($token);
			return true;
		} catch (e) {
			return false;
		}
	} else {
		return false;
	}
})

export {authToken, isUserAdmin, isUserLoggedIn, decodeToken};