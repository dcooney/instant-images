import React from "react";
import ReactDOM from "react-dom";
import PhotoList from "./components/PhotoList";
import API from "./constants/API";
import buildTestURL from "./functions/buildTestURL";
import buildURL from "./functions/buildURL";
import consoleStatus from "./functions/consoleStatus";
import getHeaders from "./functions/getHeaders";
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
	const url = buildURL(API[provider].photo_api, params);

	function initialize() {
		// Create fetch request.
		const headers = getHeaders(provider);
		fetch(url, { headers })
			.then((data) => data.json())
			.then(function (data) {
				const app = document.getElementById("app");
				ReactDOM.render(
					<PhotoList
						container={app}
						editor="classic"
						results={data}
						page={page}
						orderby={orderby}
						provider={provider}
					/>,
					app
				);
			})
			.catch(function (error) {
				console.log(error);
			});

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
	const defaultProvider = API.defaults.provider;
	const defaultOrder = API.defaults.order;
	const api_required = API[provider].requires_key;

	// Send test API request to confirm API key is functional.
	if (api_required) {
		try {
			const headers = getHeaders(provider);
			const response = await fetch(buildTestURL(provider), { headers });

			// Handle response.
			const { ok, status } = response;

			if (ok) {
				// Success.
				GetPhotos(1, defaultOrder, provider);
			} else {
				// Status Error: Fallback to default provider.
				GetPhotos(1, defaultOrder, defaultProvider);

				// Render console warning.
				consoleStatus(provider, status);
			}
		} catch (error) {
			// API Error: Fallback to default provider.
			GetPhotos(1, defaultOrder, defaultProvider);
		}
	} else {
		// API Error: Fallback to default provider.
		GetPhotos(1, defaultOrder, defaultProvider);
	}
})();
