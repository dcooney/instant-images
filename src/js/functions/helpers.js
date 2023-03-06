/**
 * Check if an object is empty.
 *
 * @param {object}   obj The object to test against.
 * @return {Boolean}     Is this an object.
 */
export function isObjectEmpty(obj) {
	if (obj === null || obj === undefined) {
		return true;
	}
	return Object.keys(obj).length === 0;
}

/**
 * Check the `x-ratelimit-remaining` headers to confirm the API is available.
 *
 * @param {object} headers The request headers object.
 */
export function checkRateLimit(headers) {
	if (!headers) {
		return;
	}
	const limit = headers.get('X-RateLimit-Limit') || -1;
	const remaining = headers.get('X-RateLimit-Remaining') || -1;
	if (limit > -1 && parseInt(remaining) < 2) {
		alert(instant_img_localize.api_ratelimit_msg);
	}
}

/**
 * Capitalize the first letter of a string.
 *
 * @param  {string} str The string to format.
 * @return {string}     The formatted string.
 */
export function capitalizeFirstLetter(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
