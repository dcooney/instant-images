import React from "react";
import ReactDOM from "react-dom";
import PhotoList from "./components/PhotoList";
import API from "./constants/API";
import buildURL from "./functions/buildURL";
import checkRateLimit from "./functions/checkRateLimit";
import consoleStatus from "./functions/consoleStatus";
import getProvider from "./functions/getProvider";
import getQueryParams from "./functions/getQueryParams";
require("es6-promise").polyfill();
require("isomorphic-fetch");
require("./functions/helpers");

// Get provider from settings.
const provider = getProvider();

/**
 * Get the initial set of photos.
 *
 * @param {Number} page     The start page.
 * @param {string} orderby  The default order.
 * @param {string} provider The current service provider.
 */
function GetPhotos(
	page = 1,
	orderby = API.defaults.order,
	provider = API.defaults.provider
) {
	const container = document.querySelector(".instant-img-container");

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
			ReactDOM.render(
				<PhotoList
					container={app}
					editor="classic"
					results={results}
					page={page}
					orderby={orderby}
					provider={provider}
					error={error}
				/>,
				document.getElementById("app")
			);
		} catch (error) {
			consoleStatus(provider, status);
		}

		// Remove init button (if required).
		const initWrap = container.querySelector(".initialize-wrap");
		if (typeof initWrap != "undefined" && initWrap != null) {
			initWrap.parentNode.removeChild(initWrap);
		}
	}
	initialize();
}

/**
 * Dispatch an initial fetch request to confirm the default API key is valid.
 */
(async () => {
	const defaultOrder = API.defaults.order;
	GetPhotos(1, defaultOrder, provider);
})();
