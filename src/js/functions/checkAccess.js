import API from "../constants/API";

/**
 * Confirm user has access to the API.
 *
 * @param {string} provider The current provider.
 * @return {boolen}         Does the user have access.
 */
export default async function checkAccess(provider) {
	const start = `${API[provider].photo_api}${API[provider].api_query_var}${API[provider].app_id}`;
	const url = `${start}&per_page=10&page=1`;

	// Get Data from API
	const response = await fetch(url);

	if (response.ok && response.status === 200) {
		// Valid API key.
		return true;
	} else if (response.status >= 400 || response.status <= 401) {
		// Return false if forbidden or unauthorized.
		return false;
	} else {
		// Not sure, just return false.
		return false;
	}
}
