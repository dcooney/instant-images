/**
 * Build the API query parameters.
 *
 * @param  {string} type   The query type (search, photos, id).
 * @param  {object} params The current params object.
 * @return {string} 		   The new API URL with querystring params.
 */
export default function buildURL(type, params) {
	if (!type) {
		// Bail early if API query type is missing.
		return "";
	}
	// Get the current provider.
	const { provider = "unsplash" } = params;

	// Delete provider from the params object as it doesn't need to be sent.
	delete params.provider;

	// Build the API URL.
	const url = new URL(getProxyURL(provider, params));

	// Add `type` to params.
	url.searchParams.append("type", type);

	// Append query params.
	Object.keys(params).forEach(key => {
		url.searchParams.append(key, params[key]);
	});

	// Add `version` to params.
	url.searchParams.append("version", instant_img_localize.version);

	return url;
}

/**
 * Get the proxy URL from ENV vars.
 *
 * @param  {string} provider The image provider.
 * @param  {array}  params   The query params.
 * @return {string}          The proxy URL.
 */
export function getProxyURL(provider, params) {
	if (provider === "pexels") {
		// Bail early if pexels.
		if (params.term) {
			// Pexels search.
			return `https://api.pexels.com/v1/search?query=${params.term}`;
		}
		return "https://api.pexels.com/v1/curated";
	}

	const proxy =
		process && process.env && process.env.PROXY_URL
			? `${process.env.PROXY_URL}${provider}`
			: `https://proxy.getinstantimages.com/api/${provider}`;
	return proxy;
}
