import React from "react";
import ReactDOM from "react-dom";
import PhotoList from "./components/PhotoList";
import API from "./constants/API";
require("es6-promise").polyfill();
require("isomorphic-fetch");
require("./functions/helpers");

const provider = "unsplash";

/**
 * Get the initial set of photos.
 *
 * @param {Number} page     The start page.
 * @param {string} orderby  The default order.
 * @param {string} provider The current service provider.
 */
const GetPhotos = (page = 1, orderby = "latest", provider = "unsplash") => {
	const container = document.querySelector(".instant-img-container");

	const start = `${API[provider].photo_api}${API[provider].app_id}`;
	const url = `${start}${API.posts_per_page}&page=${page}&${API[provider].order_key}=${orderby}`;

	function initialize() {
		// Remove init button
		let initWrap = container.querySelector(".initialize-wrap");
		if (typeof initWrap != "undefined" && initWrap != null) {
			initWrap.parentNode.removeChild(initWrap);
		}

		// Get Data from API
		fetch(url)
			.then((data) => data.json())
			.then(function (data) {
				const element = document.getElementById("app");
				ReactDOM.render(
					<PhotoList
						container={element}
						editor="classic"
						results={data}
						page={page}
						orderby={orderby}
						provider={provider}
					/>,
					element
				);
			})
			.catch(function (error) {
				console.log(error);
			});
	}
	initialize();
};

GetPhotos(1, "latest", provider);
