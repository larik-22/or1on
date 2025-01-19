import {authToken} from "../stores/auth";
import page from "page";
import {userLocation} from "../stores/userLocation";

/**
 * Handles authentication errors based on the response status.
 * @param response - The fetch response object.
 * @returns The response object if no auth error is detected.
 * @throws An error if an auth error is detected.
 */
const handleAuthError = async (response: Response): Promise<Response> => {
	if (!response.ok) {
		if (response.status === 401 || response.status === 403) {
			logout();
			throw new Error('Authentication error: Token is expired or invalid.');
		}
	}

	return response;
};

/**
 * Handles authentication response and stores the token if successful.
 * @param response - The fetch response object.
 * @returns The response object if no auth error is detected.
 * @throws An error if an auth error is detected.
 */
const handleAuthResponse = async (response: Response): Promise<Response> => {
	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.error.message || "An error occurred.");
	}

	const data = await response.json();
	setToken(data.token);

	return response;
};


/**
 * Saves the authentication token to localStorage and the authToken store.
 * This makes the token available for the app to use later.
 * Does nothing if the token is null.
 *
 * @param token - The authentication token to save, or null to skip saving.
 */
const setToken = (token: string | null) => {
	if (!token) {
		return;
	}

	localStorage.setItem("token", token);
	authToken.set(token);
}

/**
 * Logs out the user by clearing the token and redirecting to the login page.
 */
const logout = () => {
	userLocation.set(null);
	authToken.set(null);
	localStorage.removeItem('token');
	page.redirect('/login');
}

export {logout, handleAuthError, handleAuthResponse, setToken};