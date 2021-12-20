import React from "react";
import ReactDOM from "react-dom";
import PhotoList from "./components/PhotoList";
import API from "./constants/API";
import buildTestURL from "./functions/buildTestURL";
import consoleStatus from "./functions/consoleStatus";
import contentSafety from "./functions/contentSafety";
import getProvider from "./functions/getProvider";
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
	// App container.
	const container = document.querySelector(".instant-img-container");

	// API Key.
	const api_key = instant_img_localize[`${provider}_app_id`];

	// API URL.
	const start = `${API[provider].photo_api}${
		API[provider].api_query_var
	}${api_key}${contentSafety(provider)}`;
	const url = `${start}${API.defaults.posts_per_page}&page=${page}&${API[provider].order_key}=${orderby}`;

	function initialize() {
		// Get Data from API
		fetch(url)
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
		const response = await fetch(buildTestURL(provider));

		// Handle response.
		const ok = response.ok;
		const status = response.status;

		if (ok) {
			// Success.
			GetPhotos(1, defaultOrder, provider);
		} else {
			// Status Error: Fallback to default provider.
			GetPhotos(1, defaultOrder, defaultProvider);

			// Render console warning.
			consoleStatus(provider, status);
		}
	} else {
		// API Error: Fallback to default provider.
		GetPhotos(1, defaultOrder, defaultProvider);
	}
})();
