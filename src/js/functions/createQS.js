/**
 * Create a querystring from an object.
 *
 * @param  {string} obj The object.
 * @return {string}     The generated querystring.
 */
export default function createQS(obj) {
	const querystring = Object.keys(obj)
		.map((key) => `${key}=${obj[key]}`)
		.join("&");

	return querystring ? `&${querystring}` : "";
}
