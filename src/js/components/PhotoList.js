import Masonry from "masonry-layout";
import React from "react";
import API from "../constants/API";
import buildTestURL from "../functions/buildTestURL";
import getResults, { getResultById } from "../functions/getResults";
import searchByID from "../functions/searchByID";
import APILightbox from "./APILightbox";
import ErrorMessage from "./ErrorMessage";
import LoadingBlock from "./LoadingBlock";
import LoadMore from "./LoadMore";
import NoResults from "./NoResults";
import Orientation from "./Orientation";
import Photo from "./Photo";
import ResultsToolTip from "./ResultsToolTip";
import Tooltip from "./Tooltip";
const imagesLoaded = require("imagesloaded");

class PhotoList extends React.Component {
	constructor(props) {
		super(props);

		// Get current provider settings.
		this.providers = ["Unsplash", "Pixabay"];

		this.provider = this.props.provider; // Unsplash, Pixabay, etc.
		this.api_provider = API[this.provider]; // The API settings for the provider.
		this.arr_key = this.api_provider.arr_key;
		this.order_key = this.api_provider.order_key;

		this.api_key = instant_img_localize[`${this.provider}_app_id`];

		this.api_url = `${this.api_provider.photo_api}${this.api_provider.api_query_var}${this.api_key}${API.posts_per_page}`;
		this.search_api_url = `${this.api_provider.search_api}${this.api_provider.api_query_var}${this.api_key}${API.posts_per_page}`;

		this.hasAPIError = this.props.hasError;

		// Results state.
		this.results = getResults(
			this.provider,
			this.arr_key,
			this.props.results
		);
		this.state = {
			results: this.results,
			restapi_error: false,
			api_lightbox: false,
		};

		this.orderby = this.props.orderby; // Orderby
		this.page = this.props.page; // Page

		this.is_search = false;
		this.search_term = "";
		this.total_results = 0;
		this.orientation = "";
		this.isLoading = false; // Loading flag.
		this.isDone = false; // Done flag.
		this.errorMsg = "";
		this.msnry = "";
		this.tooltipInterval = "";

		// Refs.
		this.photoTarget = React.createRef();
		this.providerNav = React.createRef();
		this.controlNav = React.createRef();
		this.photoSearch = React.createRef();
		this.buttonLatest = React.createRef();

		// Editor props.
		this.editor = this.props.editor ? this.props.editor : "classic";
		this.is_block_editor = this.props.editor === "gutenberg" ? true : false;
		this.is_media_router =
			this.props.editor === "media-router" ? true : false;
		this.SetFeaturedImage = this.props.SetFeaturedImage
			? this.props.SetFeaturedImage.bind(this)
			: "";
		this.InsertImage = this.props.InsertImage
			? this.props.InsertImage.bind(this)
			: "";

		if (this.is_block_editor) {
			// Gutenberg Sidebar Only
			this.container = document.querySelector("body");
			this.container.classList.add("loading");
			this.wrapper = document.querySelector("body");
		} else {
			// Post Edit Screens and Plugin Screen
			this.container = this.props.container.closest(
				".instant-img-container"
			);
			this.wrapper = this.props.container.closest(".instant-images-wrapper");
			this.container.classList.add("loading");
		}
	}

	/**
	 * Test access to the REST API.
	 *
	 * @since 3.2
	 */
	test() {
		const self = this;
		const testURL = instant_img_localize.root + "instant-images/test/"; // REST Route
		const restAPITest = new XMLHttpRequest();
		restAPITest.open("POST", testURL, true);
		restAPITest.setRequestHeader("X-WP-Nonce", instant_img_localize.nonce);
		restAPITest.setRequestHeader("Content-Type", "application/json");
		restAPITest.send();
		restAPITest.onload = function () {
			if (restAPITest.status >= 200 && restAPITest.status < 400) {
				const response = JSON.parse(restAPITest.response);
				const success = response.success;
				if (!success) {
					self.setState({ restapi_error: true });
				}
			} else {
				// Error
				self.setState({ restapi_error: true });
			}
		};
		restAPITest.onerror = function (errorMsg) {
			console.log(errorMsg);
			self.setState({ restapi_error: true });
		};
	}

	/**
	 * Trigger Search.
	 *
	 * @param {Event} event The dispatched submit event.
	 * @since 3.0
	 */
	search(event) {
		event.preventDefault();

		const input = this.photoSearch.current;
		const term = input.value;

		if (term.length > 2) {
			input.classList.add("searching");
			this.container.classList.add("loading");
			this.search_term = term;
			this.is_search = true;
			this.doSearch(this.search_term);
		} else {
			input.focus();
		}
	}

	/**
	 * Orientation filter. Availlable during a search only.
	 *
	 * @param {string} orientation The orientation of the photos.
	 * @param {MouseEvent} event The dispatched orientation setter event.
	 * @since 4.2
	 */
	setOrientation(orientation, event) {
		if (event && event.target) {
			let target = event.target;

			if (target.classList.contains("active")) {
				// Clear orientation
				target.classList.remove("active");
				this.orientation = "";
			} else {
				// Set orientation
				let siblings = target.parentNode.querySelectorAll("li");
				[...siblings].forEach((el) => el.classList.remove("active")); // remove active classes

				target.classList.add("active");
				this.orientation = orientation;
			}

			if (this.search_term !== "") {
				this.doSearch(this.search_term);
			}
		}
	}

	/**
	 * Is their an orientation set.
	 *
	 * @since 4.2
	 */
	hasOrientation() {
		return this.orientation === "" ? false : true;
	}

	/**
	 * Clear the orientation.
	 *
	 * @since 4.2
	 */
	clearOrientation() {
		const items = this.container.querySelectorAll(".orientation-list li");
		[...items].forEach((el) => el.classList.remove("active")); // remove active classes
		this.orientation = "";
	}

	/**
	 * Run the search.
	 *
	 * @param {string} term The search term.
	 * @since 3.0
	 * @updated 3.1
	 */
	doSearch(term) {
		const self = this;
		const input = this.photoSearch.current;
		let type = "term";
		this.page = 1; // reset page num

		let url = `${this.search_api_url}&page=${this.page}&${this.api_provider.search_query_var}=${this.search_term}`;

		if (this.hasOrientation()) {
			// Set orientation
			url = `${url}&orientation=${this.orientation}`;
		}

		// Search by ID.
		// Allow users to search by photo by prepending id:{photo_id} to search terms.
		const search_type = term.substring(0, 3);

		if (search_type === "id:") {
			type = "id";
			term = term.replace("id:", "");
			url = searchByID(
				this.provider,
				term,
				this.api_provider.photo_api,
				this.api_provider.api_query_var,
				this.api_key
			);
		}

		fetch(url)
			.then((data) => data.json())
			.then(function (data) {
				// Search term.
				if (type === "term") {
					const results = getResults(
						self.provider,
						self.arr_key,
						data,
						true
					);
					self.total_results = data.total;

					// Check for returned data.
					self.checkTotalResults(results.length);

					// Update Props.
					self.results = results;
					self.setState({ results: self.results });
				}

				// Search by ID.
				if (type === "id" && data) {
					// Convert return data to array.
					const photoArray = [];

					// Get results via ID.
					const result = getResultById(
						self.provider,
						self.arr_key,
						data,
						true
					);

					// Data comes back differently in a search by ID.
					if (data.errors) {
						// If error was returned (Unsplash Only).
						self.total_results = 0;
						self.checkTotalResults("0");
					} else {
						// No errors, display results
						photoArray.push(result);
						self.total_results = 1;
						self.checkTotalResults("1");
					}

					self.results = photoArray;
					self.setState({ results: self.results });
				}

				input.classList.remove("searching");
			})
			.catch(function (error) {
				console.log(error);

				// Error, reset all search parameters.
				input.classList.remove("searching");
				self.isLoading = false;
				self.total_results = 0;
				self.isDone = true;

				// Update Props.
				self.results = [];
				self.setState({ results: self.results });
			});
	}

	/**
	 * Reset search results and results view.
	 *
	 * @since 3.0
	 */
	clearSearch() {
		const input = this.photoSearch.current;
		input.value = "";
		this.total_results = 0;
		this.is_search = false;
		this.search_term = "";
		this.clearOrientation();
	}

	/**
	 * Get the initial set of photos for the current view (New/Popular/Old/etc...).
	 *
	 * @param {string}  view  Current view.
	 * @param {Element} e     The clicked element.
	 * @param {Boolean} reset Is this an app reset.
	 * @since 3.0
	 */
	getPhotos(view, e, reset = false) {
		const self = this;
		const el = e.target || e;

		if (el.classList.contains("active") && !reset) {
			return; // exit if active
		}

		el.classList.add("loading"); // Add class to nav btn
		this.isLoading = true;
		this.page = 1;
		this.orderby = view;
		this.results = [];
		this.clearSearch();

		const url = `${this.api_url}&page=${this.page}&${this.order_key}=${this.orderby}`;

		fetch(url)
			.then((data) => data.json())
			.then(function (data) {
				const results = getResults(self.provider, self.arr_key, data);

				// Check for returned data
				self.checkTotalResults(results.length);

				// Update Props.
				self.results = results;

				// Set results state.
				self.setState({ results: results });

				// Remove class from nav btn.
				el.classList.remove("loading");
			})
			.catch(function (error) {
				console.log(error);
				self.isLoading = false;
			});
	}

	/**
	 * Load next set of photos in infinite scroll style.
	 *
	 * @since 3.0
	 */
	loadMorePhotos() {
		const self = this;
		this.page = parseInt(this.page) + 1;
		this.container.classList.add("loading");
		this.isLoading = true;

		let url = `${this.api_url}&page=${this.page}&${this.order_key}=${this.orderby}`;

		if (this.is_search) {
			url = `${this.search_api_url}&page=${this.page}&${this.api_provider.search_query_var}=${this.search_term}`;

			if (this.hasOrientation()) {
				// Set orientation
				url = `${url}&orientation=${this.orientation}`;
			}
		}

		fetch(url)
			.then((data) => data.json())
			.then(function (data) {
				let moreResults = getResults(
					self.provider,
					self.arr_key,
					data,
					self.is_search
				);

				// Unsplash search results are recieved in different JSON format
				if (self.is_search && self.provider === "unsplash") {
					moreResults = data.results;
				}

				// Loop results, push items into array
				moreResults &&
					moreResults.map((data) => {
						self.results.push(data);
					});

				// Check for returned data
				self.checkTotalResults(data.length);

				// Update Props
				self.setState({ results: self.results });
			})
			.catch(function (error) {
				console.log(error);
				self.isLoading = false;
			});
	}

	/**
	 * Callback after activating and verififying an API key.
	 *
	 * @since 4.5
	 * @param {string} provider The verified provider.
	 */
	afterVerifiedAPICallback(provider) {
		const button = this.providerNav.current.querySelector(
			`button[data-provider=${provider}]`
		);
		if (!button) {
			return;
		}
		this.setState({ api_lightbox: false }); // Close the lightbox.
		document.body.classList.remove("overflow-hidden");
		button.click();
	}

	/**
	 * Close the API Lightbox.
	 *
	 * @param {string} provider The previous provider.
	 */
	closeAPILightbox(provider) {
		this.setState({ api_lightbox: false }); // Close the lightbox.
		document.body.classList.remove("overflow-hidden");

		// Set focus on previous provider button.
		const target = this.providerNav.current.querySelector(
			`button[data-provider=${provider}]`
		);
		if (target) {
			target.focus({ preventScroll: true });
		}
	}

	/**
	 * Toggles the service provider.
	 *
	 * @since 4.5
	 * @param {Event} e The clicked element event.
	 */
	async switchProvider(e) {
		const target = e.currentTarget;
		const provider = target.dataset.provider;

		if (provider === this.provider) {
			return false; // Exit if already selected.
		}

		// API Checker.
		// Bounce if API key for service is invalid.
		if (API[provider].requires_key) {
			const response = await fetch(buildTestURL(provider));
			const ok = response.ok;
			const status = response.status;

			if (!ok || status === 400 || status === 401 || status === 500) {
				this.setState({ api_lightbox: provider }); // Show API Lightbox.
				document.body.classList.add("overflow-hidden");
				return;
			}
		}

		// Set new state provider.
		this.provider = provider;
		this.api_provider = API[this.provider];

		// Remove active from buttons.
		this.providerNav.current.querySelectorAll("button").forEach((button) => {
			button.classList.remove("active");
		});

		// Select active button.
		target.classList.add("active");

		// Set current provider params.
		this.arr_key = this.api_provider.arr_key;
		this.order_key = this.api_provider.order_key;
		this.api_key = instant_img_localize[`${this.provider}_app_id`];

		this.api_url = `${this.api_provider.photo_api}${this.api_provider.api_query_var}${this.api_key}${API.posts_per_page}`;
		this.search_api_url = `${this.api_provider.search_api}${this.api_provider.api_query_var}${this.api_key}${API.posts_per_page}`;

		// At last, get the photos.
		this.getPhotos("latest", this.buttonLatest.current, true);
	}

	/**
	 * Renders the Masonry layout.
	 *
	 * @since 3.0
	 */
	renderLayout() {
		if (this.is_block_editor) {
			return false;
		}
		const self = this;
		const photoListWrapper = self.photoTarget.current;
		imagesLoaded(photoListWrapper, function () {
			self.msnry = new Masonry(photoListWrapper, {
				itemSelector: ".photo",
			});
			self.photoTarget.current.querySelectorAll(".photo").forEach((el) => {
				el.classList.add("in-view");
			});
		});
	}

	/**
	 * Scrolling function.
	 *
	 * @since 3.0
	 */
	onScroll() {
		let wHeight = window.innerHeight;
		let scrollTop = window.pageYOffset;
		let scrollH = document.body.scrollHeight - 400;
		if (wHeight + scrollTop >= scrollH && !this.isLoading && !this.isDone) {
			this.loadMorePhotos();
		}
	}

	/**
	 * A checker to determine is there are remaining search results.
	 *
	 * @param num   int    Total search results
	 * @since 3.0
	 */
	checkTotalResults(num) {
		this.isDone = num == 0 ? true : false;
	}

	/**
	 * Sets the main navigation active state.
	 *
	 * @since 3.0
	 */
	setActiveState() {
		const self = this;
		// Remove .active class from control nav.
		this.controlNav.current
			.querySelectorAll("button")
			.forEach((el) => el.classList.remove("active"));

		// Set active item, if not search.
		if (!this.is_search) {
			const active = this.controlNav.current.querySelector(
				`li button.instant-images-${this.orderby}`
			);
			if (active) {
				active.classList.add("active");
			}
		}
		setTimeout(function () {
			self.isLoading = false;
			self.container.classList.remove("loading");
		}, 1000);
	}

	/**
	 * Show the tooltip.
	 *
	 * @since 4.3.0
	 */
	showTooltip(e) {
		const self = this;
		const target = e.currentTarget;
		const rect = target.getBoundingClientRect();
		let left = Math.round(rect.left);
		const top = Math.round(rect.top);
		const tooltip = this.container.querySelector("#tooltip");
		tooltip.classList.remove("over");

		if (target.classList.contains("tooltip--above")) {
			tooltip.classList.add("above");
		} else {
			tooltip.classList.remove("above");
		}

		// Delay Tooltip Reveal.
		this.tooltipInterval = setInterval(function () {
			clearInterval(self.tooltipInterval);
			tooltip.innerHTML = target.dataset.title; // Tooltip content.

			// Position Tooltip.
			left = left - tooltip.offsetWidth + target.offsetWidth + 5;
			tooltip.style.left = `${left}px`;
			tooltip.style.top = `${top}px`;

			setTimeout(function () {
				tooltip.classList.add("over");
			}, 150);
		}, 750);
	}

	/**
	 * Hide the tooltip.
	 *
	 * @since 4.3.0
	 */
	hideTooltip() {
		clearInterval(this.tooltipInterval);
		let tooltip = this.container.querySelector("#tooltip");
		tooltip.classList.remove("over");
	}

	// Component Updated
	componentDidUpdate() {
		this.renderLayout();
		this.setActiveState();
	}

	// Component Init
	componentDidMount() {
		this.renderLayout();
		this.setActiveState();
		this.test();
		this.container.classList.remove("loading");
		this.wrapper.classList.add("loaded");

		if (this.is_block_editor || this.is_media_router) {
			// Gutenberg || Media Popup
			this.page = 0;
			this.loadMorePhotos();
		} else {
			// Add scroll event
			window.addEventListener("scroll", () => this.onScroll());
		}
	}

	render() {
		return (
			<div id="photo-listing" className={this.provider}>
				{this.providers && (
					<nav className="provider-nav" ref={this.providerNav}>
						{this.providers.map((provider, iterator) => (
							<div key={`provider-${iterator}`}>
								<button
									data-provider={provider.toLowerCase()}
									onClick={(e) => this.switchProvider(e)}
									className={
										this.provider === provider.toLowerCase()
											? "provider-nav--btn active"
											: "provider-nav--btn"
									}
								>
									{provider}
								</button>
							</div>
						))}
					</nav>
				)}

				{this.state.api_lightbox && (
					<APILightbox
						provider={this.state.api_lightbox}
						afterVerifiedAPICallback={this.afterVerifiedAPICallback.bind(
							this
						)}
						closeAPILightbox={this.closeAPILightbox.bind(this)}
					/>
				)}

				{this.api_provider.order && (
					<ul className="control-nav" ref={this.controlNav}>
						<li>
							<i
								className="fa fa-sort-amount-asc"
								aria-hidden="true"
							></i>
						</li>
						{this.api_provider.order.map((order, iterator) => (
							<li key={`${this.provider}-order-${iterator}`}>
								<button
									type="button"
									className={`instant-images-${order}`}
									onClick={(e) => this.getPhotos(order, e)}
									ref={order === "latest" ? this.buttonLatest : null}
								>
									{instant_img_localize[order]}
								</button>
							</li>
						))}
						<li className="search-field" id="search-bar">
							<form onSubmit={(e) => this.search(e)} autoComplete="off">
								<label htmlFor="photo-search" className="offscreen">
									{instant_img_localize.search_label}
								</label>
								<input
									type="search"
									id="photo-search"
									placeholder={instant_img_localize.search}
									ref={this.photoSearch}
								/>
								<button type="submit" id="photo-search-submit">
									<i className="fa fa-search"></i>
								</button>
								<ResultsToolTip
									container={this.container}
									buttonLatest={this.buttonLatest}
									isSearch={this.is_search}
									total={this.total_results}
									title={
										this.total_results +
										" " +
										instant_img_localize.search_results +
										" " +
										this.search_term
									}
								/>
							</form>
						</li>
					</ul>
				)}

				{this.state.restapi_error && <ErrorMessage />}

				{this.is_search && (
					<Orientation
						provider={this.provider}
						setOrientation={this.setOrientation.bind(this)}
					/>
				)}

				<div id="photos" className="photo-target" ref={this.photoTarget}>
					{this.state.results.map((result, iterator) => (
						<Photo
							provider={this.provider}
							result={result}
							key={`${this.provider}-${result.id}-${iterator}`}
							editor={this.editor}
							mediaRouter={this.is_media_router}
							blockEditor={this.is_block_editor}
							SetFeaturedImage={this.SetFeaturedImage}
							InsertImage={this.InsertImage}
							showTooltip={this.showTooltip}
							hideTooltip={this.hideTooltip}
						/>
					))}
				</div>

				{this.total_results == 0 && this.is_search === true && (
					<NoResults />
				)}

				<LoadingBlock />
				<LoadMore loadMorePhotos={this.loadMorePhotos} />
				<Tooltip />
			</div>
		);
	}
}

export default PhotoList;
