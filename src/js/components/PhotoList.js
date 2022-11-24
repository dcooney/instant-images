import classNames from "classnames";
import Masonry from "masonry-layout";
import React from "react";
import API from "../constants/API";
import FILTERS from "../constants/filters";
import buildTestURL from "../functions/buildTestURL";
import buildURL from "../functions/buildURL";
import checkRateLimit from "../functions/checkRateLimit";
import consoleStatus from "../functions/consoleStatus";
import getQueryParams from "../functions/getQueryParams";
import getResults, {
	getResultById,
	getSearchTotalByProvider
} from "../functions/getResults";
import searchByID from "../functions/searchByID";
import APILightbox from "./APILightbox";
import ErrorLightbox from "./ErrorLightbox";
import Filter from "./Filter";
import LoadingBlock from "./LoadingBlock";
import LoadMore from "./LoadMore";
import NoResults from "./NoResults";
import Photo from "./Photo";
import RestAPIError from "./RestAPIError";
import ResultsToolTip from "./ResultsToolTip";
import Tooltip from "./Tooltip";
const imagesLoaded = require("imagesloaded");

class PhotoList extends React.Component {
	constructor(props) {
		super(props);

		// Get current provider settings.
		this.providers = API.providers;
		this.provider = this.props.provider; // Unsplash, Pixabay, etc.
		this.api_provider = API[this.provider]; // The API settings for the provider.
		this.arr_key = this.api_provider.arr_key;
		this.per_page = API.defaults.per_page;

		// API Vars.
		this.api_key = instant_img_localize[`${this.provider}_app_id`];
		this.photo_api = this.api_provider.photo_api;
		this.search_api = this.api_provider.search_api;

		this.api_error = this.props.error;

		// Results state.
		this.results = getResults(
			this.provider,
			this.arr_key,
			this.props.results
		);

		this.state = {
			results: this.results,
			filters: FILTERS[this.provider].filters,
			search_filters: FILTERS[this.provider].search,
			restapi_error: false,
			api_lightbox: false
		};

		this.filters = {};
		this.search_filters = {};
		this.show_search_filters = true;

		this.orderby = this.props.orderby; // Orderby
		this.page = this.props.page; // Page

		this.is_search = false;
		this.search_term = "";
		this.total_results = 0;
		this.view = "";
		this.isLoading = false; // Loading flag.
		this.isDone = false; // Done flag.
		this.errorMsg = "";
		this.msnry = "";
		this.tooltipInterval = "";
		this.delay = 250;

		// Refs.
		this.photoTarget = React.createRef();
		this.providerNav = React.createRef();
		this.controlNav = React.createRef();
		this.photoSearch = React.createRef();
		this.filterGroups = React.createRef();

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
			this.search_term = term;
			this.is_search = true;
			this.doSearch(this.search_term);
		} else {
			input.focus();
		}
	}

	/**
	 * Reset search results, settings and results view.
	 *
	 * @since 3.0
	 */
	clearSearch() {
		this.photoSearch.current.value = "";
		this.total_results = 0;
		this.is_search = false;
		this.search_term = "";
		this.search_filters = {}; // Reset search filters.
		this.toggleFilters(); // Re-enable filters.
	}

	/**
	 * Click event for the control nav items.
	 *
	 * @param {Event} e The clicked element event.
	 * @param {string}  view  Current view.
	 * @since 4.6
	 */
	controlsClick(e, view) {
		const target = e.currentTarget;
		this.view = view;
		if (!target.classList.contains("active")) {
			this.getPhotos(view);
		}
	}

	/**
	 * Perform a photo search.
	 *
	 * @param {string} term The search term.
	 * @since 3.0
	 */
	async doSearch(term) {
		const self = this;
		const search_type = term.substring(0, 3) === "id:" ? "id" : "term";
		const input = this.photoSearch.current;
		const photoTarget = this.photoTarget.current;

		// Set loading variables and options.
		photoTarget.classList.add("loading");
		this.isLoading = true;
		this.page = 1; // Reset current page num.
		this.toggleFilters(); // Disable filters.

		// Build API URL.
		let search_url = this.search_api;
		let search_query = {};

		if (search_type === "id") {
			search_url = searchByID(this, term);
		} else {
			search_query = {
				[this.api_provider.search_var]: this.search_term
			};
		}

		// Build URL.
		const search_params = {
			...search_query,
			...this.search_filters,
			...{ page: this.page }
		};
		const params = getQueryParams(this.provider, search_params);
		const url = buildURL(search_url, params);

		// Create fetch request.
		const response = await fetch(url);
		const { status, headers } = response;
		checkRateLimit(headers);

		try {
			// Get response data.
			const data = await response.json();

			// Switch search types. Term or ID.
			switch (search_type) {
				case "term":
					const results = getResults(
						this.provider,
						this.arr_key,
						data,
						true
					);

					this.total_results = getSearchTotalByProvider(
						this.provider,
						data
					);

					// Check for returned data.
					this.checkTotalResults(results.length);

					// Update Props.
					this.show_search_filters = this.total_results > 0 ? true : false;
					this.results = results;
					this.setState({
						results: this.results,
						search_filters: FILTERS[this.provider].search
					});

					break;

				case "id":
					// Convert return data to array.
					const photoArray = [];

					// Get results via ID.
					const result = getResultById(
						this.provider,
						this.arr_key,
						data,
						true
					);

					// Data comes back differently in a search by ID.
					if (data.errors) {
						// If error was returned (Unsplash Only).
						this.total_results = 0;
						this.checkTotalResults("0");
					} else {
						// No errors, display results
						photoArray.push(result);
						this.total_results = 1;
						this.checkTotalResults("1");
						this.isDone = true;
					}

					this.show_search_filters = false;
					this.results = photoArray;
					this.setState({ results: self.results });
					break;
			}

			// Delay for effect.
			setTimeout(function() {
				input.classList.remove("searching");
				photoTarget.classList.remove("loading");
				self.isLoading = false;
			}, this.delay);
		} catch (error) {
			// Reset all search parameters.
			this.isDone = true;
			this.isLoading = false;
			this.show_search_filters = false;
			this.total_results = 0;
			input.classList.remove("searching");
			photoTarget.classList.remove("loading");

			// Update Props.
			this.results = [];
			this.setState({ results: this.results });
			consoleStatus(this.provider, status);
		}
	}

	/**
	 * Get the initial set of photos for the current view (New/Popular/Filters/etc...).
	 *
	 * @param {string}  view     Current view.
	 * @param {Boolean} reset    Is this an app reset.
	 * @param {Boolean} switcher Is this a provider switch.
	 * @since 3.0
	 */
	async getPhotos(view, reset = false, switcher = false) {
		if (this.isLoading && !reset) {
			return;
		}

		const self = this;
		this.photoTarget.current.classList.add("loading");
		this.isLoading = true;
		this.page = 1;
		this.orderby = view;
		this.results = [];
		this.clearSearch();

		// Build URL.
		const params = getQueryParams(this.provider, this.filters);
		const url = buildURL(this.photo_api, params);

		// Create fetch request.
		const response = await fetch(url);
		const { status, headers } = response;
		checkRateLimit(headers);

		// Status OK.
		try {
			const data = await response.json();
			const { error = null } = data; // Get error reporting.

			const results = getResults(this.provider, this.arr_key, data);
			this.checkTotalResults(results.length); // Check for returned data.
			this.results = results; // Update Props.
			this.api_error = error;

			// Set results state.
			if (!switcher) {
				this.setState({
					results: results
				});
			} else {
				this.setState({
					results: results,
					filters: FILTERS[this.provider].filters
				});
			}
		} catch (error) {
			consoleStatus(this.provider, status);
			this.photoTarget.current.classList.remove("loading");
			this.isLoading = false;
		}

		// Delay loading animatons for effect.
		setTimeout(function() {
			self.photoTarget.current.classList.remove("loading");
			self.isLoading = false;
		}, self.delay);
	}

	/**
	 * Load next set of photos in infinite scroll style.
	 *
	 * @since 3.0
	 */
	async loadMorePhotos() {
		const self = this;
		this.container.classList.add("loading");
		this.isLoading = true;
		this.page = parseInt(this.page) + 1;

		// Get search query.
		let search_query = {};
		if (this.is_search) {
			search_query = {
				[this.api_provider.search_var]: this.search_term
			};
		}

		// Build URL.
		const loadmore_url = this.is_search ? this.search_api : this.photo_api;
		const filters = this.is_search ? this.search_filters : this.filters;
		const loadmore_params = {
			...filters,
			...search_query,
			...{ page: this.page }
		};
		const params = getQueryParams(this.provider, loadmore_params);
		const url = buildURL(loadmore_url, params);

		// Create fetch request.
		const response = await fetch(url);
		const { status, headers } = response;
		checkRateLimit(headers);

		try {
			const data = await response.json();
			let results = getResults(
				this.provider,
				this.arr_key,
				data,
				this.is_search
			);

			// Unsplash search results are returned in different JSON format
			if (this.is_search && this.provider === "unsplash") {
				results = data.results;
			}

			// Loop result & push items into array.
			results &&
				results.map(data => {
					self.results.push(data);
				});

			// Check the total results.
			this.checkTotalResults(results.length);

			// Set results state.
			this.setState({ results: this.results });
		} catch (error) {
			consoleStatus(this.provider, status);
			self.isLoading = false;
		}
	}

	/**
	 * Filter the photo listing.
	 *
	 * @param {string} filter The current filter key.
	 * @param {string} value  The value to filter.
	 */
	filterPhotos(filter, value) {
		if (
			(this.filters[filter] && value === "#") ||
			value === "" ||
			value === "all"
		) {
			delete this.filters[filter];
		} else {
			this.filters[filter] = value;
		}
		this.getPhotos(this.view, true);
	}

	/**
	 * Filter the search results.
	 *
	 * @param {string} filter The current filter key.
	 * @param {string} value  The value to filter.
	 */
	filterSearch(filter, value) {
		if (
			(this.search_filters[filter] && value === "#") ||
			value === "" ||
			value === "all"
		) {
			delete this.search_filters[filter];
		} else {
			this.search_filters[filter] = value;
		}
		this.doSearch(this.search_term);
	}

	/**
	 * Toggle the active state of all filters.
	 */
	toggleFilters() {
		const filters = this.filterGroups.current.querySelectorAll(
			"button.filter-dropdown--button"
		);
		if (filters) {
			filters.forEach(button => {
				button.disabled = this.is_search ? true : false;
			});
		}
		if (this.is_search) {
			this.filterGroups.current.classList.add("inactive");
		} else {
			this.filterGroups.current.classList.remove("inactive");
		}
	}

	/**
	 * Callback after activating and verififying an API key.
	 *
	 * @param {string} provider The verified provider.
	 * @since 4.5
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
	 * @param {Event} e The clicked element event.
	 * @since 4.5
	 */
	async switchProvider(e) {
		const target = e.currentTarget;
		const provider = target.dataset.provider;

		if (provider === this.provider) {
			return false; // Exit if already selected.
		}

		// API Checker.
		// Bounce if API key for provider is invalid.
		if (API[provider].requires_key) {
			const self = this;
			try {
				const response = await fetch(buildTestURL(provider));
				const { status, headers } = response;
				checkRateLimit(headers);

				if (status !== 200) {
					// Catch API errors and 401s.
					self.setState({ api_lightbox: provider }); // Show API Lightbox.
					document.body.classList.add("overflow-hidden");
					return;
				}
			} catch (error) {
				// Catch all other errors.
				self.setState({ api_lightbox: provider }); // Show API Lightbox.
				document.body.classList.add("overflow-hidden");
				return;
			}
		}

		// Remove active from buttons.
		this.providerNav.current.querySelectorAll("button").forEach(button => {
			button.classList.remove("active");
		});

		// Select active button.
		target.classList.add("active");

		// Update API provider params.
		this.provider = provider;
		this.api_provider = API[this.provider];
		this.arr_key = this.api_provider.arr_key;
		this.api_key = instant_img_localize[`${this.provider}_app_id`];
		this.photo_api = this.api_provider.photo_api;
		this.search_api = this.api_provider.search_api;

		// Clear all filters.
		this.filters = {};
		this.search_filters = {};

		// Finally, fetch the photos.
		this.view = "latest";
		this.getPhotos(this.view, true, true);
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
		imagesLoaded(photoListWrapper, function() {
			self.msnry = new Masonry(photoListWrapper, {
				itemSelector: ".photo"
			});
			self.photoTarget.current.querySelectorAll(".photo").forEach(el => {
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
		const wHeight = window.innerHeight;
		const scrollTop = window.pageYOffset;
		const scrollH = document.body.scrollHeight - 200;
		if (wHeight + scrollTop >= scrollH && !this.isLoading && !this.isDone) {
			this.loadMorePhotos();
		}
	}

	/**
	 * A checker to determine if there are remaining search results.
	 *
	 * @param {number} num Total search results.
	 * @since 3.0
	 */
	checkTotalResults(num) {
		this.isDone = parseInt(num) === 0 || num === undefined ? true : false;
	}

	/**
	 * Sets the loading state.
	 *
	 * @since 3.0
	 */
	doneLoading() {
		const self = this;
		setTimeout(function() {
			self.isLoading = false;
			self.container.classList.remove("loading");
		}, self.delay);
	}

	/**
	 * Show the tooltip.
	 *
	 * @param {Event} e The clicked element event.
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
		this.tooltipInterval = setInterval(function() {
			clearInterval(self.tooltipInterval);
			tooltip.innerHTML = target.dataset.title; // Tooltip content.

			// Position Tooltip.
			left = left - tooltip.offsetWidth + target.offsetWidth + 5;
			tooltip.style.left = `${left}px`;
			tooltip.style.top = `${top}px`;

			setTimeout(function() {
				tooltip.classList.add("over");
			}, self.delay);
		}, 750);
	}

	/**
	 * Hide the tooltip.
	 *
	 * @since 4.3.0
	 */
	hideTooltip() {
		clearInterval(this.tooltipInterval);
		const tooltip = this.container.querySelector("#tooltip");
		tooltip.classList.remove("over");
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
		restAPITest.onload = function() {
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
		restAPITest.onerror = function(errorMsg) {
			console.warn(errorMsg);
			self.setState({ restapi_error: true });
		};
	}

	// Component Updated
	componentDidUpdate() {
		this.renderLayout();
		this.doneLoading();
	}

	// Component Init
	componentDidMount() {
		this.renderLayout();
		this.doneLoading();
		this.test();
		this.container.classList.remove("loading");
		this.wrapper.classList.add("loaded");

		// Not Gutenberg and Media Popup add scroll listener.
		if (!this.is_block_editor && !this.is_media_router) {
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
									onClick={e => this.switchProvider(e)}
									className={
										this.provider === provider.toLowerCase()
											? "provider-nav--btn active"
											: "provider-nav--btn"
									}
								>
									<span>{provider}</span>
									{API[provider.toLowerCase()].new && (
										<span className="provider-nav--new">
											{instant_img_localize.new}
										</span>
									)}
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

				<div className="control-nav" ref={this.controlNav}>
					<div
						className={classNames(
							"control-nav--filters-wrap",
							this.api_error ? "inactive" : null
						)}
						ref={this.filterGroups}
					>
						{Object.entries(this.state.filters).length && (
							<div className="control-nav--filters">
								{Object.entries(this.state.filters).map(
									([key, filter], i) => (
										<Filter
											key={`${key}-${this.provider}-${i}`}
											filterKey={key}
											provider={this.provider}
											data={filter}
											function={this.filterPhotos.bind(this)}
										/>
									)
								)}
							</div>
						)}
					</div>

					<div
						className={classNames(
							"control-nav--search",
							"search-field",
							this.api_error ? "inactive" : null
						)}
						id="search-bar"
					>
						<form onSubmit={e => this.search(e)} autoComplete="off">
							<label htmlFor="photo-search" className="offscreen">
								{instant_img_localize.search_label}
							</label>
							<input
								type="search"
								id="photo-search"
								placeholder={instant_img_localize.search}
								ref={this.photoSearch}
								disabled={this.api_error}
							/>
							<button
								type="submit"
								id="photo-search-submit"
								disabled={this.api_error}
							>
								<i className="fa fa-search"></i>
							</button>
							<ResultsToolTip
								container={this.container}
								getPhotos={this.getPhotos.bind(this)}
								isSearch={this.is_search}
								total={this.total_results}
								title={`${this.total_results} ${instant_img_localize.search_results} ${this.search_term}`}
							/>
						</form>
					</div>
				</div>

				{this.state.restapi_error && (
					<RestAPIError
						title={instant_img_localize.error_restapi}
						desc={instant_img_localize.error_restapi_desc}
						type="warning"
					/>
				)}

				{this.is_search && this.editor !== "gutenberg" && (
					<div className="search-results-header">
						<h2>{this.search_term}</h2>
						<div className="search-results-header--text">
							{`${this.total_results} ${instant_img_localize.search_results}`}{" "}
							<strong>{`${this.search_term}`}</strong>
							{" - "}
							<button
								title={instant_img_localize.clear_search}
								onClick={() => this.getPhotos("latest")}
							>
								{instant_img_localize.clear_search}
							</button>
						</div>
						{this.show_search_filters &&
							Object.entries(this.state.search_filters).length && (
								<div className="control-nav--filters-wrap">
									<div className="control-nav--filters">
										{Object.entries(this.state.search_filters).map(
											([key, filter], i) => (
												<Filter
													key={`${key}-${i}`}
													filterKey={key}
													provider={this.provider}
													data={filter}
													function={this.filterSearch.bind(this)}
												/>
											)
										)}
									</div>
								</div>
							)}
					</div>
				)}

				<div id="photos" className="photo-target" ref={this.photoTarget}>
					{this.state.results.length
						? this.state.results.map((result, iterator) => (
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
						  ))
						: null}
				</div>
				{this.total_results < 1 && this.is_search === true && (
					<NoResults
						total={this.total_results}
						is_search={this.is_search}
					/>
				)}
				<LoadingBlock />
				<LoadMore loadMorePhotos={this.loadMorePhotos.bind(this)} />
				<ErrorLightbox error={this.api_error} provider={this.provider} />
				<Tooltip />
			</div>
		);
	}
}

export default PhotoList;
