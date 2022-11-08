/**
 * Build the API query parameters.
 *
 * @param  {string}  dest   The base API URL.
 * @param  {object}  params The current params object.
 * @return {string} 			 The new API URL with querystring params.
 */
export default function buildURL(dest, params) {
	if (!dest) {
		return "";
	}

	//const proxy = "https://instant-images-proxy.vercel.app/api/images";
	const proxy = "http://localhost:3000/api/images";

	const url = new URL(proxy);
	Object.keys(params).forEach(key => {
		url.searchParams.append(key, params[key]);
	});
	url.searchParams.append("dest", dest);

	return url;
}
