/**
 * Build the API query parameters.
 *
 * @param  {string}  dest   The base API URL.
 * @param  {object}  params The current params object.
 * @return {string} 			 The new API URL with querystring params.
 */
export default function buildURL(dest, params) {
	if (!dest) {
		// Bail early is destination URL is missing.
		return "";
	}
	// Get the current provider.
	const { provider = "unsplash" } = params;
	delete params.provider;

	console.log(process.env);
	const url = new URL(getProxyURL(provider)); // Build the URL.

	// Append query params.
	Object.keys(params).forEach(key => {
		url.searchParams.append(key, params[key]);
	});
	url.searchParams.append("dest", dest);

	return url;
}

/**
 * Get the proxy URL from ENV vars.
 *
 * @param  {string} provider The image provider.
 * @return {string}          The proxy URL.
 */
export function getProxyURL(provider) {
	const proxy =
		process && process.env && process.env.PROXY_URL
			? `${process.env.PROXY_URL}${provider}`
			: `https://proxy.getinstantimages.com/api/${provider}`;
	return proxy;
}
