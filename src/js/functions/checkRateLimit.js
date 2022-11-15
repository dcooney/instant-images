/**
 * Check the `x-ratelimit-remaining` headers to confirm the API is available.
 *
 * @param  {object}  headers  The request headers object.
 */
export default function checkRateLimit(headers) {
	if (!headers) {
		return;
	}
	const remaining = headers.get("X-Ratelimit-remaining");
	if (parseInt(remaining) < 2) {
		alert(instant_img_localize.api_ratelimit_msg);
	}
}
