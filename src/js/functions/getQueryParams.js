import API from "../constants/API";

/**
 * Build the API query parameters
 *
 * @param  {string}  provider  The current service provider.
 * @param  {object}  filters   Optional query filters to append to base params.
 * @return {object} 				 Parameters used for the fetch request.
 */
export default function getQueryParams(provider, filters) {
	if (!provider) {
		return {};
	}

	// Default params.
	let params = {
		per_page: API.defaults.per_page,
	};

	params = getAuth(params, provider);
	params = getContentSafety(params, provider);
	params = { ...params, ...filters };

	/**
	 * Display query params in the browser console.
	 *
	 * Global plugin hook.
	 */
	if (instant_img_localize.query_debug) {
		console.table(params);
	}
	return params;
}

/**
 * Set the photo safety for indicating that only images suitable for all ages should be returned.
 * @see https://unsplash.com/documentation#content-safety
 * @see https://pixabay.com/api/docs/
 *
 * @param  {object}  params   The current params object.
 * @param  {string}  provider The current service provider.
 * @return {object} 				The fetch parameters object.
 */
export function getAuth(params, provider) {
	const has_auth = API[provider].api_var ? true : false;
	if (!has_auth || !provider) {
		return params;
	}
	params[API[provider].api_var] = instant_img_localize[`${provider}_app_id`];
	return params;
}

/**
 * Set the photo safety for indicating that only images suitable for all ages should be returned.
 * @see https://unsplash.com/documentation#content-safety
 * @see https://pixabay.com/api/docs/
 *
 * @param  {object}  params   The current params object.
 * @param  {string}  provider The current service provider.
 * @return {object} 				The fetch parameters object.
 */
export function getContentSafety(params, provider) {
	switch (provider) {
		case "unsplash":
			if (instant_img_localize.unsplash_content_filter) {
				params.content_filter =
					instant_img_localize.unsplash_content_filter;
			}
			break;

		case "pixabay":
			if (instant_img_localize.pixabay_safesearch) {
				params.safesearch = instant_img_localize.pixabay_safesearch;
			}
			break;
	}
	return params;
}
