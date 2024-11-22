import { API } from '../constants/API';

/**
 * Pluck `results` from the API response.
 *
 * @param {Object} data The API results object.
 * @return {Array} 	   The results as an array.
 */
export default function getResults(data) {
	if (!data) {
		return [];
	}

	return data[API.defaults.arr_key] || [];
}

/**
 * Get the total search results.
 *
 * @param {Object} data The search data object.
 * @return {string}     The total results.
 */
export function getSearchTotal(data) {
	// Return 0 if undefined or null.
	return data.total === undefined || data.total === null ? 0 : data.total;
}

/**
 * Get results by photo ID.
 *
 * @param {string} provider The current service provider.
 * @param {string} key      The match key to access.
 * @param {Object} data     The API results object.
 * @return {Array} 		  The results as an array.
 * @deprecated 5.0
 */
export function getResultById(provider, key, data) {
	if (!data) {
		return [];
	}

	let result = [];
	switch (provider) {
		case 'unsplash':
		case 'pexels':
			result = data || [];
			break;

		case 'pixabay':
			result = data[key] && data[key][0] ? data[key][0] : [];
			break;
	}

	return result;
}
