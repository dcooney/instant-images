import buildURL from "./buildURL";
import getQueryParams from "./getQueryParams";

/**
 * Build a API testing URL.
 *
 * @param  {string} provider  The current service provider.
 * @return {string}           The API URL.
 */
export default function buildTestURL(provider) {
	let options = {
		per_page: 5,
		page: 1
	};

	// Build URL.
	const params = {
		test: true,
		...getQueryParams(provider),
		...options
	};

	return buildURL("photos", params);
}
