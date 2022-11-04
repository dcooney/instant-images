/**
 * Build the required auth headers for the provider.
 *
 * @param  {string} provider The current provider.
 * @return {object}          The headers as an object.
 */
export default function getHeaders(provider) {
	const api_key = instant_img_localize[`${provider}_app_id`];
	let headers = {};
	switch (provider) {
		case "pexels":
			headers = {
				Authorization: api_key
			};
			break;

		default:
			break;
	}

	return headers;
}
