import API from "../constants/API";

/**
 * Build a API testing URL.
 *
 * @param  {string} provider  The current service provider.
 * @return {string}           The API URL.
 */
export default function buildTestURL(provider) {
	const api = API[provider];
	const api_key = instant_img_localize[`${provider}_app_id`];
	const url = `${api.photo_api}${api.api_query_var}${api_key}&per_page=5&page=1`;

	return url;
}
