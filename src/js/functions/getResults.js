/**
 * Access the results of different providers.
 * Unsplash and Pixabay return results in different object formats.
 *
 * @param  {string}  provider  The current service provider.
 * @param  {string}  key       The match key to access.
 * @param  {Array}   data      The photo array.
 * @param  {Boolean} is_search Is this a search request.
 * @return {Array} 				 The photos as an array.
 */
export default function getResults(provider, key, data, is_search) {
	if (!data) {
		return [];
	}

	let results = [];
	switch (provider) {
		case "unsplash":
			if (is_search) {
				results = data[key] || [];
			} else {
				results = data || [];
			}
			break;

		default:
			results = data[key] || [];
			break;
	}

	return results;
}

/**
 * Get results by photo ID.
 *
 * @param  {string}  provider  The current service provider.
 * @param  {string}  key       The match key to access.
 * @param  {Array}   data      The photo array.
 * @return {Array} 				 The photos as an array.
 */
export function getResultById(provider, key, data) {
	if (!data) {
		return [];
	}

	let result = [];
	switch (provider) {
		case "unsplash":
		case "pexels":
			result = data || [];
			break;

		case "pixabay":
			result = data[key] && data[key][0] ? data[key][0] : [];
			break;
	}

	return result;
}

/**
 * Get the total search results by provider.
 *
 * @param  {string} provider The current service provider.
 * @param  {object} obj      The search data object.
 * @return {string}          The total results.
 */
export function getSearchTotalByProvider(provider, obj) {
	let total = "";
	switch (provider) {
		case "pexels":
			total = obj.total_results;
			break;

		default:
			total = obj.total;
			break;
	}

	// Set total to 0 if undefined.
	total = total === undefined ? 0 : total;
	return total;
}
