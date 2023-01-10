/**
 * Build the required auth headers for the provider (Pexels only).
 *
 * @param  {string} provider The current provider.
 * @return {object}          The headers as an object.
 */
export default function getHeaders(provider) {
	if (provider !== "pexels") {
		// Bail early if not pexels.
		return {};
	}

	// Get key from settings.
	const pexels_key = instant_img_localize[`${provider}_app_id`];

	// Set key or fallback.
	const api_key = pexels_key
		? pexels_key
		: "563492ad6f9170000100000120aa91a03d6b495c84870df1be8e1cd8";

	// Return the auth header with key.
	return {
		headers: {
			Authorization: api_key
		}
	};
}
