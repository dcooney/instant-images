import API from "../constants/API";

/**
 * Build the required auth headers for the provider (Pexels only).
 *
 * @param  {string} provider The current provider.
 * @return {object}          The headers as an object.
 * @deprecated 5.2.0
 */
export default function getHeaders(provider) {
	if (provider !== "pexels") {
		// Bail early if not pexels.
		return {};
	}

	// Get key from settings.
	const pexels_key = instant_img_localize[`${provider}_app_id`];

	// Set custom API key or fallback key.
	const key = pexels_key ? pexels_key : API["pexels"].key;

	// Return the auth header with key.
	return {
		headers: {
			Authorization: key,
		},
	};
}
