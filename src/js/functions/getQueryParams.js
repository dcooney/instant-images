import { API } from '../constants/API';

// eslint-disable

/**
 * Build the API query parameters
 *
 * @param {string} provider    The current service provider.
 * @param {Object} queryParams Optional query parameters to append to base params.
 * @return {Object} 				 Parameters used for the fetch request.
 */
export default function getQueryParams(provider, queryParams) {
	if (!provider) {
		return {};
	}

	// Set default params.
	let params = {
		provider,
	};

	// Append additional params.
	params = getContentSafety(params, provider);
	params = { ...params, ...queryParams };
	params = getAuth(params, provider);

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
 * Get auth keys and append to API query request.
 *
 * @param {Object} params   The current params object.
 * @param {string} provider The current service provider.
 * @return {Object}         The auth parameter object.
 */
export function getAuth(params, provider) {
	const has_auth = API[provider].requires_key;
	if (!has_auth || !provider) {
		return params;
	}

	const app_id = instant_img_localize[`${provider}_app_id`];
	if (app_id) {
		// Pass API keys if not using defaults.
		params[API[provider].api_var] = app_id;
	}
	return params;
}

/**
 * Set the photo safety for indicating that only images suitable for all ages should be returned.
 *
 * @see https://unsplash.com/documentation#content-safety
 * @see https://pixabay.com/api/docs/
 *
 * @param {Object} params   The current params object.
 * @param {string} provider The current service provider.
 * @return {Object} 			 The fetch parameters object.
 */
export function getContentSafety(params, provider) {
	switch (provider) {
		case 'unsplash':
			if (instant_img_localize.unsplash_content_filter) {
				params.content_filter = instant_img_localize.unsplash_content_filter;
			}
			break;

		case 'pixabay':
			if (instant_img_localize.pixabay_safesearch) {
				params.safesearch = 'true';
			}
			break;

		case 'openverse':
			if (instant_img_localize.openverse_mature) {
				params.mature = 'true';
			}
			break;
	}
	return params;
}
