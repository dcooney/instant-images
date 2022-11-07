/**
 * Build the API query parameters.
 *
 * @param  {string}  url     The base API URL.
 * @param  {object}  params  The current params object.
 * @return {string} 			  The new API URL with querystring params.
 */
export default function buildURL(url, params) {
	if (!url) {
		return "";
	}

	url = "http://localhost:3000/api/images";
	//url = "https://instant-images-proxy.vercel.app/api/images";
	const api_url = new URL(url);
	Object.keys(params).forEach(key => {
		api_url.searchParams.append(key, params[key]);
	});

	return api_url;
}
