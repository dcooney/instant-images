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
	let results = [];
	switch (provider) {
		case "unsplash":
			if (is_search) {
				results = data[key] || [];
			} else {
				results = data || [];
			}
			break;

		case "pixabay":
			results = data[key] || [];
			break;
	}

	return results;
}

export function getResultById(provider, key, data) {
	let result = [];
	switch (provider) {
		case "unsplash":
			result = data || [];
			break;

		case "pixabay":
			result = data[key] && data[key][0] ? data[key][0] : [];
			break;
	}

	return result;
}
