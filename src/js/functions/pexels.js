import getProp from "./getProp";

/**
 * This file contain temporary helper functions until Pexels is able to be run on the Instant Images proxy.
 *
 * @see https://wordpress.org/support/topic/pexels-fails-to-validate-api-or-return-search-results/
 */

/**
 * Format the results of the Pexels API response.
 * Note: This is a temporary fix until Pexels API issues are resolved.
 *
 * @param  {object} data The API data.
 * @return {array}       An array of object containing the formatted results.
 */
export function getPexelsResults(data) {
	const results = data && data["photos"];
	if (!results && results.length) {
		// Bail early if no results.
		return [];
	}

	// Create the results object.
	const obj =
		results.length &&
		results.map(result => {
			return {
				id: result.id,
				permalink: getProp("pexels", result, "link"),
				likes: getProp("pexels", result, "likes"),
				urls: {
					thumb: getProp("pexels", result, "thumb"),
					img: getProp("pexels", result, "img"),
					full: getProp("pexels", result, "full_size"),
					alt: getProp("pexels", result, "likes"),
					download_url: false
				},
				user: {
					username: getProp("pexels", result, "user"),
					name: getProp("pexels", result, "name"),
					photo: false,
					url: getProp("pexels", result, "user_url")
				}
			};
		});

	return obj;
}

/**
 * Get the total number of results from Pexels API.
 *
 * @param {array} data The photo array data.
 * @param {string} search_type The search type.
 * @return {string} The total results.
 */
export function getPexelsSearchTotal(data, search_type) {
	if (!data) {
		return 0;
	}
	if (search_type === "id") {
		return data["photos"] ? data["photos"].length : 0;
	}
	return data.total_results || 0;
}
