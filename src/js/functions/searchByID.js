/**
 * Get the API URL for searching by ID.
 * Prepending id:{photo_id} to search terms will search photos by unique ID.
 *
 * @param  {object} options  An object containing provider variables.
 * @param  {string} term     The photo search term.
 * @return {string}          The search API URL.
 * @deprecated 5.0
 */
export default function searchByID(options, term) {
	const { provider, api_provider } = options;
	const { photo_api } = api_provider;
	const id = term.replace("id:", "").replace(/\s+/, "");

	let url = "";
	switch (provider) {
		case "unsplash":
			// https://api.unsplash.com/photos/{PHOTO_ID}
			url = `${photo_api}${id}`;
			break;

		case "pixabay":
			// https://pixabay.com/api/?id={PHOTO_ID}
			url = `${photo_api}?id=${id}`;
			break;

		case "pexels":
			// https://api.pexels.com/v1/photos/{PHOTO_ID}
			url = `${photo_api.replace("curated", "photos")}/${id}`;
			break;
	}

	return url;
}
