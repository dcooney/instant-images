/**
 * Get the API URL for searching by ID.
 * Prepending id:{photo_id} to search terms will search photos by unique ID.
 *
 * @param  {object} options  An object containing provider variables.
 * @param  {string} id       The photo id.
 * @return {string}          The search API URL.
 */
export default function searchByID(options, id) {
	const { provider, api_provider, api_key } = options;
	const { photo_api, api_query_var } = api_provider;
	id = id.replace("id:", "");

	let url = "";
	switch (provider) {
		case "unsplash":
			url = `${photo_api}${id}?${api_query_var}${api_key}`; // https://api.unsplash.com/photos/{PHOTO_ID}
			break;

		case "pixabay":
			url = `${photo_api}?id=${id}&${api_query_var}${api_key}`;
			// https://pixabay.com/api/?id={PHOTO_ID}
			break;

		case "pexels":
			url = `${photo_api.replace("curated", "photos")}${id}`;
			// https://api.pexels.com/v1/photos/{PHOTO_ID}
			break;
	}

	return url;
}
