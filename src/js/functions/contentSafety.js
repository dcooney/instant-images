/**
 * Set the photo safety for indicating that only images suitable for all ages should be returned.
 * @see https://unsplash.com/documentation#content-safety
 * @see https://pixabay.com/api/docs/
 *
 * @param  {string}  provider  The current service provider.
 * @return {string} 				 The api string for filtering content.
 */
export default function contentSafety(provider) {
	let str = "";
	switch (provider) {
		case "unsplash":
			if (instant_img_localize.unsplash_content_filter) {
				str = `&content_filter=${instant_img_localize.unsplash_content_filter}`;
			}
			break;

		case "pixabay":
			if (instant_img_localize.pixabay_safesearch) {
				str = `&safesearch=${instant_img_localize.pixabay_safesearch}`;
			}
			break;
	}
	return str;
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
