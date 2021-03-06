import React from "react";
import ReactDOM from "react-dom";
import API from "./components/API";
import PhotoList from "./components/PhotoList";

require("es6-promise").polyfill();
require("isomorphic-fetch");
require("./functions/helpers");

const GetPhotos = (page = 1, orderby = "latest", service = "unsplash") => {
	let container = document.querySelector(".instant-img-container");
	let url = `${API.photo_api}${API.app_id}${API.posts_per_page}&page=${page}&order_by=${orderby}`;

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
				let element = document.getElementById("app");
				ReactDOM.render(
					<PhotoList
						container={element}
						editor="classic"
						results={data}
						page={page}
						orderby={orderby}
						service={service}
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

GetPhotos(1, "latest", "unsplash");
