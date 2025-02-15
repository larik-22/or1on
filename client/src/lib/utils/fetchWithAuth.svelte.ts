import {handleAuthError} from "./authHandler.svelte.js";

/**
 * Fetch with authentication header attached.
 * Throws an error and logs out user if token is expired or malfunctioned.
 * @param url – The URL to fetch
 * @param options – The fetch options
 */
const fetchWithAuthSvelte = async (url: string, options: RequestInit = {}): Promise<Response> => {
	const token = localStorage.getItem('token');
	if (!token) {
		throw new Error('No token found');
	}

	const headers = {
		...options.headers,
		Authorization: `Bearer ${token}`,
	};

	const response = await fetch(url, { ...options, headers });
	return handleAuthError(response);
}

export { fetchWithAuthSvelte };