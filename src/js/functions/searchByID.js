/**
 * Get the API URL for searching by ID.
 * Prepending id:{photo_id} to search terms will search photos by unique ID.
 *
 * @param  {object} options  An object containing provider variables.
 * @param  {string} term     The photo search term.
 * @return {string}          The search API URL.
 */
export default function searchByID(options, term) {
	const { provider, api_provider } = options;
	const { photo_api } = api_provider;
	const id = term.replace("id:", "").replace(/\s+/, "");

	let url = "";
	switch (provider) {
		case "unsplash":
			url = `${photo_api}${id}`; // https://api.unsplash.com/photos/{PHOTO_ID}
			break;

		case "pixabay":
			url = `${photo_api}?id=${id}`; // https://pixabay.com/api/?id={PHOTO_ID}
			break;

		case "pexels":
			url = `${photo_api.replace("curated", "photos")}/${id}`; // https://api.pexels.com/v1/photos/{PHOTO_ID}
			break;
	}

	return url;
}
