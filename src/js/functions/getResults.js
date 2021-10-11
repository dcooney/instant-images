
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
 export default function getResults(provider, key, data, is_search){
	if(provider === 'unsplash'){
		if(is_search){
			return data[key] || [];
		} else {
			return data || [];
		}
	}
	if(provider === 'pixabay'){
		return data[key] || [];
	}
}
