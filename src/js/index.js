import { createRoot, render } from "@wordpress/element";
import InstantImages from "./components/InstantImages";
import { API } from "./constants/API";
import buildURL from "./functions/buildURL";
import consoleStatus from "./functions/consoleStatus";
import getProvider from "./functions/getProvider";
import getQueryParams from "./functions/getQueryParams";
import { checkRateLimit } from "./functions/helpers";
import { deleteSession, getSession, saveSession } from "./functions/session";
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
		const app = document.getElementById("app");
		if (app) {
			// Get session storage.
			const sessionData = getSession(url);

			if (sessionData) {
				// Display results from session.
				if (createRoot) {
					const root = createRoot(app);
					root.render(
						<InstantImages
							editor="classic"
							data={sessionData}
							container={app}
							provider={provider}
							api_error={null}
						/>
					);
				} else {
					render(
						<InstantImages
							editor="classic"
							data={sessionData}
							container={app}
							provider={provider}
							api_error={null}
						/>,
						app
					);
				}
			} else {
				// Dispatch API fetch request.
				const response = await fetch(url);
				const { status, headers } = response;
				checkRateLimit(headers);

				try {
					// Get response data.
					const results = await response.json();
					const { error = null } = results;
					if (createRoot) {
						const root = createRoot(app);
						root.render(
							<InstantImages
								editor="classic"
								data={results}
								container={app}
								provider={provider}
								api_error={error}
							/>
						);
					} else {
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
					saveSession(url, results);
				} catch (error) {
					consoleStatus(provider, status);
					deleteSession(url);
				}
			}
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
