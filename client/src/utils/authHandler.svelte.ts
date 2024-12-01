import {authToken} from "../stores/auth";
import page from "page";

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
		throw new Error(errorData.error || "An error occurred.");
	}

	const data = await response.json();
	localStorage.setItem("token", data.token);
	authToken.set(data.token);

	return response;
};

/**
 * Logs out the user by clearing the token and redirecting to the login page.
 */
const logout = () => {
	authToken.set(null);
	localStorage.removeItem('token');
	page.redirect('/login');
}

export {logout, handleAuthError, handleAuthResponse};