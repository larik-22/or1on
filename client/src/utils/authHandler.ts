import {authToken} from "../stores/auth";
import page from "page";

// a function to handle auth error (expired, malfunctioned token)
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

const logout = () => {
	authToken.set(null);
	localStorage.removeItem('token');
	page.redirect('/login');
}

export {logout, handleAuthError};