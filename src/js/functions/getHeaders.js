/**
 * Build the required auth headers for the provider.
 *
 * @param  {string} provider The current provider.
 * @return {object}          The headers as an object.
 * @deprecated 2.0
 */
export default function getHeaders(provider) {
	const api_key = instant_img_localize[`${provider}_app_id`];
	let headers = {};
	switch (provider) {
		case "pexels":
			if (api_key) {
				headers = {
					Authorization: api_key
				};
			}
			break;

		default:
			break;
	}

	return headers;
}
