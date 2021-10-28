import React from "react";
import ReactDOM from "react-dom";
import PhotoList from "./components/PhotoList";
import API from "./constants/API";
import buildTestURL from "./functions/buildTestURL";
import consoleStatus from "./functions/consoleStatus";
import getProvider from "./functions/getProvider";
require("es6-promise").polyfill();
require("isomorphic-fetch");
require("./functions/helpers");

// Global vars
let activeFrameId = "";
let activeFrame = "";

// Load MediaFrame deps
const oldMediaFrame = wp.media.view.MediaFrame.Post;
const oldMediaFrameSelect = wp.media.view.MediaFrame.Select;

// Create Instant Images Tabs
wp.media.view.MediaFrame.Select = oldMediaFrameSelect.extend({
	// Tab / Router
	browseRouter(routerView) {
		oldMediaFrameSelect.prototype.browseRouter.apply(this, arguments);
		routerView.set({
			instantimages: {
				text: instant_img_localize.instant_images,
				priority: 120,
			},
		});
	},

	// Handlers
	bindHandlers() {
		oldMediaFrameSelect.prototype.bindHandlers.apply(this, arguments);
		this.on("content:create:instantimages", this.frameContent, this);
	},

	/**
	 * Render callback for the content region in the `browse` mode.
	 *
	 * @param {wp.media.controller.Region} contentRegion
	 */
	frameContent(contentRegion) {
		const state = this.state();
		// Get active frame
		if (state) {
			activeFrameId = state.id;
			activeFrame = state.frame.el;
		}
	},

	getFrame(id) {
		return this.states.findWhere({ id });
	},
});

wp.media.view.MediaFrame.Post = oldMediaFrame.extend({
	// Tab / Router
	browseRouter(routerView) {
		oldMediaFrameSelect.prototype.browseRouter.apply(this, arguments);
		routerView.set({
			instantimages: {
				text: instant_img_localize.instant_images,
				priority: 120,
			},
		});
	},

	// Handlers
	bindHandlers() {
		oldMediaFrame.prototype.bindHandlers.apply(this, arguments);
		this.on("content:create:instantimages", this.frameContent, this);
	},

	/**
	 * Render callback for the content region in the `browse` mode.
	 *
	 * @param {wp.media.controller.Region} contentRegion
	 */
	frameContent(contentRegion) {
		const state = this.state();
		// Get active frame
		if (state) {
			activeFrameId = state.id;
			activeFrame = state.frame.el;
		}
	},

	getFrame(id) {
		return this.states.findWhere({ id });
	},
});

// Render Instant Images
const instantImagesMediaTab = () => {
	const html = createWrapperHTML(); // Create HTML wrapper

	if (!activeFrame) {
		return false; // Exit if not a frame.
	}

	const modal = activeFrame.querySelector(".media-frame-content"); // Get all media modals
	if (!modal) {
		return false; // Exit if not modal.
	}

	modal.innerHTML = ""; // Clear any existing modals.
	modal.appendChild(html); // Append Instant Images to modal.

	const element = modal.querySelector(
		"#instant-images-media-router-" + activeFrameId
	);
	if (!element) {
		return false; // Exit if not element.
	}

	getMediaModalProvider(element);
};

/**
 * Get the provider before initializing Instant Images.
 *
 * @param {Element} element The Instant Images HTML element to initialize.
 */
const getMediaModalProvider = async (element) => {
	// Get provider and options from settings.
	const provider = getProvider();
	const defaultProvider = API.defaults.provider;
	const api_required = API[provider].requires_key;

	// Send test API request to confirm API key is functional.
	if (api_required) {
		const response = await fetch(buildTestURL(provider));

		// Handle response.
		const ok = response.ok;
		const status = response.status;

		if (ok) {
			// Success.
			renderPhotoList(element, provider);
		} else {
			// Status Error: Fallback to default provider.
			renderPhotoList(element, defaultProvider);

			// Render console warning.
			consoleStatus(provider, status);
		}
	} else {
		// API Error: Fallback to default provider.
		renderPhotoList(element, provider);
	}
};

/**
 * Render the main PhotoList Instant Images component.
 *
 * @param {Element} element  The Instant Images HTML element to initialize.
 * @param {string}  provider The verified provider.
 * @return {Element}         The PhotoList component.
 */
const renderPhotoList = (element, provider) => {
	ReactDOM.render(
		<PhotoList
			container={element}
			editor="media-router"
			page={1}
			orderby={API.defaults.order}
			provider={provider}
		/>,
		element
	);
};

/**
 * Create HTML markup to wrap Instant Images.
 *
 * @return {Element} Create the HTML markup for the media modal.
 */
const createWrapperHTML = () => {
	const wrapper = document.createElement("div");
	wrapper.classList.add("instant-img-container");

	const container = document.createElement("div");
	container.classList.add("instant-images-wrapper");

	const frame = document.createElement("div");
	frame.setAttribute("id", "instant-images-media-router-" + activeFrameId);

	container.appendChild(frame);
	wrapper.appendChild(container);

	return wrapper;
};

// Document Ready
jQuery(document).ready(function ($) {
	if (wp.media) {
		// Open
		wp.media.view.Modal.prototype.on("open", function () {
			if (!activeFrame) {
				return false;
			}
			let selectedTab = activeFrame.querySelector(
				".media-router button.media-menu-item.active"
			);
			if (selectedTab && selectedTab.id === "menu-item-instantimages") {
				instantImagesMediaTab();
			}
		});

		// Click Handler
		$(document).on(
			"click",
			".media-router button.media-menu-item",
			function () {
				const selectedTab = activeFrame.querySelector(
					".media-router button.media-menu-item.active"
				);
				if (selectedTab && selectedTab.id === "menu-item-instantimages") {
					instantImagesMediaTab();
				}
			}
		);
	}
});
