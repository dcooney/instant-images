/**
 * Format the params for openverse.
 *
 * @param  {string} type   Query type (search, photos, id).
 * @param  {object} params Query params object.
 * @return {object} 		   Updated params.
 */
export function openverseParams(type, params) {
	if (type === "photos" && !params.source) {
		// Add `wordpress` as the default `source` for openverse.
		params["source"] = "wordpress";
	}
	if (type === "search") {
		// Exlude these sources from search.
		const excluded = "500px, rawpixel, wikimedia";
		params["excluded_source"] = excluded;
	}

	return params;
}
