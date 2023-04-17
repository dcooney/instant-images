import { OPENVERSE_SOURCES } from "../constants/openverse";

/**
 * Format the params for openverse.
 *
 * @param {string} type   Query type (search, photos, id).
 * @param {Object} params Query params object.
 * @return {Object} 		  Updated params.
 */
export function openverseParams(type, params) {
	if (type === "photos" && !params.source) {
		params.source = "wordpress"; // Add `wordpress` as the default `source` for openverse.
	}
	if (type === "search") {
		// Include these sources only.
		params.source = OPENVERSE_SOURCES.toString();
	}

	return params;
}
