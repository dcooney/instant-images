import { OPENVERSE_SOURCES } from "../../constants/filters/openverse";

/**
 * Format the params for Openverse.
 *
 * @param {string} type   Query type (search, photos, id).
 * @param {Object} params Query params object.
 * @return {Object} 		  Updated params.
 */
export function openverseParams(type, params) {
	if (type === "photos" && !params.source) {
		params.source = "wordpress"; // Add `wordpress` as the default openverse `source`.
	}

	if (type === "search") {
		// Include these sources only.
		const sources = OPENVERSE_SOURCES.map((source) => {
			return source.value;
		}).toString(); // e.g. `wordpress,flickr,nasa,spacex,wikimedia`
		params.source = sources;
	}

	return params;
}
