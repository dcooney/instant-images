import CryptoJS from "crypto-js";

/**
 * Get the MD5 hash from a URL.
 *
 * @param {string} url The API URL to hash.
 * @return {string} The MD5 hash.
 */
export function md5Hash(url) {
	return CryptoJS.MD5(url).toString();
}

/**
 * Save data to local storage.
 *
 * @param {string} url     Save results to session by URL.
 * @param {Array}  results The API results.
 */
export function saveSession(url, results) {
	if (!url || !results) {
		return false;
	}
	sessionStorage.setItem(md5Hash(url), JSON.stringify(results));
}

/**
 * Get results from session storage by URL.
 *
 * @param {string} url The API URL.
 * @return {Array|boolean} The results as an array.
 */
export function getSession(url) {
	if (!url) {
		return false;
	}
	const data = sessionStorage.getItem(md5Hash(url));
	return data ? JSON.parse(data) : false;
}

/**
 * Remove/delete session storage by URL.
 *
 * @param {string} url The API URL.
 */
export function deleteSession(url) {
	if (!url) {
		return false;
	}
	sessionStorage.removeItem(md5Hash(url));
}
