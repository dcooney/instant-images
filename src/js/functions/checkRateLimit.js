/**
 * Check the `x-ratelimit-remaining` headers to confirm the API is available.
 *
 * @param {object} headers The request headers object.
 */
export default function checkRateLimit(headers) {
	if (!headers) {
		return;
	}
	const limit = headers.get("X-RateLimit-Limit") || -1;
	const remaining = headers.get("X-RateLimit-Remaining") || -1;
	if (limit > -1 && parseInt(remaining) < 2) {
		alert(instant_img_localize.api_ratelimit_msg);
	}
}
