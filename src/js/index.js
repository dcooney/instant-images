import React from "react";
import ReactDOM from "react-dom";
import PhotoList from "./components/PhotoList";
import API from "./constants/API";
require("es6-promise").polyfill();
require("isomorphic-fetch");
require("./functions/helpers");

// Default Provider.
const provider =
	instant_img_localize && instant_img_localize.default_provider
		? instant_img_localize.default_provider
		: "unsplash";

// Default API Key.
const api_key = instant_img_localize[`${provider}_app_id`];

/**
 * Get the initial set of photos.
 *
 * @param {Number} page     The start page.
 * @param {string} orderby  The default order.
 * @param {string} provider The current service provider.
 */
function GetPhotos(page = 1, orderby = "latest", provider = "unsplash") {
	const container = document.querySelector(".instant-img-container");
	const start = `${API[provider].photo_api}${API[provider].api_query_var}${api_key}`;
	const url = `${start}${API.posts_per_page}&page=${page}&${API[provider].order_key}=${orderby}`;

	/**
	 * Render the InstantImages app.
	 *
	 * @param {array}   data  The photo array.
	 * @param {boolean} error Was there an error detected?
	 * @return {Element}      The PhotoList component.
	 */
	function renderApp(data, error = false) {
		const app = document.getElementById("app");
		ReactDOM.render(
			<PhotoList
				container={app}
				editor="classic"
				results={data}
				page={page}
				orderby={orderby}
				provider={provider}
				hasError={error}
			/>,
			app
		);
	}

	/**
	 * Initialize Instant Images.
	 */
	function initialize() {
		// Remove init button (if necessary)
		const initWrap = container.querySelector(".initialize-wrap");
		if (typeof initWrap != "undefined" && initWrap != null) {
			initWrap.parentNode.removeChild(initWrap);
		}

		// Get Data from API
		fetch(url)
			.then((data) => {
				if (data.status >= 200 && data.status <= 299) {
					return data.json();
				} else if (data.status === 400) {
					renderApp("", true);
				} else {
					throw Error(data.statusText);
				}
			})
			.then(function (data) {
				renderApp(data);
			})
			.catch(function (error) {
				console.log(error);
			});
	}
	initialize();
}

GetPhotos(1, "latest", provider);
