/**
 * Get the API URL for searches by ID.
 *
 * @param  {string} provider  The current service provider.
 * @param  {string} id        The photo id.
 * @param  {string} attribute The base api URL.
 * @param  {string} app_id    The provider API key.
 * @return {string}           The API URL.
 */
export default function searchByID(
	provider,
	id,
	base_url,
	api_query_var,
	app_id
) {
	let url = "";
	switch (provider) {
		case "unsplash":
			url = `${base_url}/${id}${api_query_var}${app_id}`;
			break;

		case "pixabay":
			url = `${base_url}${api_query_var}${app_id}&id=${id}`;
			break;
	}

	return url;
}
