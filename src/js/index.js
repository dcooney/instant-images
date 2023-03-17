import { render } from "@wordpress/element";
import InstantImages from "./components/InstantImages";
import API from "./constants/API";
import buildURL from "./functions/buildURL";
import { checkRateLimit } from "./functions/helpers";
import consoleStatus from "./functions/consoleStatus";
import getProvider from "./functions/getProvider";
import getQueryParams from "./functions/getQueryParams";
require("./functions/polyfills");

import "../scss/style.scss";

// Get provider from settings.
const defaultProvider = getProvider();

/**
 * Get the initial set of photos.
 *
 * @param {string} provider The current service provider.
 */
function getImages(provider = API.defaults.provider) {
	// Build URL.
	const params = getQueryParams(provider);
	const url = buildURL("photos", params);

	async function initialize() {
		// Create fetch request.
		const response = await fetch(url);
		const { status, headers } = response;
		checkRateLimit(headers);

		try {
			// Get response data.
			const results = await response.json();
			const { error = null } = results;
			const app = document.getElementById("app");
			if (app) {
				render(
					<InstantImages
						editor="classic"
						data={results}
						container={app}
						provider={provider}
						api_error={error}
					/>,
					app
				);
			}
		} catch (error) {
			consoleStatus(provider, status);
		}
	}
	initialize();
}

/**
 * Dispatch an initial fetch request to confirm the default API key is valid.
 */
(async () => {
	getImages(defaultProvider);
})();
