import { Fragment, useRef, useState, useEffect } from '@wordpress/element';
import classNames from 'classnames';
import Masonry from 'masonry-layout';
import API from '../constants/API';
import FILTERS from '../constants/filters';
import buildURL, { buildTestURL } from '../functions/buildURL';
import { checkRateLimit } from '../functions/helpers';
import consoleStatus from '../functions/consoleStatus';
import getQueryParams from '../functions/getQueryParams';
import getResults, { getSearchTotal } from '../functions/getResults';
import { isObjectEmpty } from '../functions/helpers';
import APILightbox from './APILightbox';
import ErrorLightbox from './ErrorLightbox';
import Filter from './Filter';
import LoadingBlock from './LoadingBlock';
import LoadMore from './LoadMore';
import NoResults from './NoResults';
import Photo from './Photo';
import RestAPIError from './RestAPIError';
import ResultsToolTip from './ResultsToolTip';
import Sponsor from './Sponsor';
import Tooltip from './Tooltip';
const imagesLoaded = require('imagesloaded');

/**
 * Render the PhotoList component.
 *
 * @param {Object} props The component props.
 * @return {JSX.Element} The PhotoList component.
 */
export default function PhotoList(props) {
	let { provider, results, error, orderby, page, editor, container, setFeaturedImage, insertImage } = props;

	// Get current provider settings.
	const providers = API.providers;

	let api_provider = API[provider]; // The API settings for the provider.
	const per_page = API.defaults.per_page;

	// API Vars.
	let api_key = instant_img_localize[`${provider}_app_id`];
	let photo_api = api_provider?.photo_api;
	let search_api = api_provider?.search_api;
	let api_error = error;

	// Results state.
	results = getResults(results);

	const [state, setState] = useState({
		results: results,
		filters: FILTERS[provider].filters,
		search_filters: FILTERS[provider].search,
		restapi_error: false,
		api_lightbox: false,
	});

	let filters = {};
	let search_filters = {};
	let show_search_filters = true;

	let is_search = false;
	let search_term = '';
	let total_results = 0;
	let view = '';
	let isLoading = false; // Loading flag.
	let isDone = false; // Done flag.
	let errorMsg = '';
	let msnry = '';
	let tooltipInterval = '';
	let delay = 250;

	// Refs.
	const photoTarget = useRef();
	const providerNav = useRef();
	const controlNav = useRef();
	const photoSearch = useRef();
	const filterGroups = useRef();
	const filterRef = [];

	// Editor props.
	editor = editor ? editor : 'classic';
	let is_block_editor = editor === 'gutenberg' ? true : false;
	let is_media_router = editor === 'media-router' ? true : false;

	let wrapper = null;

	if (is_block_editor) {
		// Gutenberg Sidebar Only
		container = document.querySelector('body');
		container.classList.add('loading');
		wrapper = document.querySelector('body');
	} else {
		// Post Edit Screens and Plugin Screen
		container = container.closest('.instant-img-container');
		wrapper = container.closest('.instant-images-wrapper');
		container.classList.add('loading');
	}

	/**
	 * Reset the filters.
	 */
	function resetFilters() {
		if (filterRef?.length) {
			filterRef.forEach((filter) => {
				if (filter) {
					filter.reset();
				}
			});
		}
	}

	/**
	 * Trigger Search.
	 *
	 * @param {Event} event The dispatched submit event.
	 * @since 3.0
	 */
	function search(event) {
		event.preventDefault();
		const input = photoSearch.current;
		const term = input.value;

		resetFilters();

		if (term.length > 2) {
			input.classList.add('searching');
			search_term = term;
			search_filters = {};
			is_search = true;
			doSearch(search_term);
		} else {
			input.focus();
		}
	}

	/**
	 * Reset search results, settings and results view.
	 *
	 * @since 3.0
	 */
	function clearSearch() {
		photoSearch.current.value = '';
		total_results = 0;
		is_search = false;
		search_term = '';
		search_filters = {}; // Reset search filters.
		toggleFilters(); // Re-enable filters.
	}

	/**
	 * Click event for the control nav items.
	 *
	 * @param {Event} e The clicked element event.
	 * @param {string}  view  Current view.
	 * @since 4.6
	 */
	function controlsClick(e, view) {
		const target = e.currentTarget;
		view = view;
		if (!target.classList.contains('active')) {
			getPhotos(view);
		}
	}

	/**
	 * Perform a photo search.
	 *
	 * @param {string} term The search term.
	 * @since 3.0
	 */
	async function doSearch(term) {
		const search_type = term.substring(0, 3) === 'id:' ? 'id' : 'term';

		// Set loading variables and options.
		photoTarget.current.classList.add('loading');
		isLoading = true;
		page = 1; // Reset current page num.
		toggleFilters(); // Disable filters.

		// Get search query.
		let search_query = {};
		if (search_type === 'id') {
			show_search_filters = false;
			search_query = {
				id: search_term.replace('id:', '').replace(/\s+/, ''),
			};
		} else {
			show_search_filters = true;
			search_query = {
				term: search_term,
			};
		}

		// Build URL.
		const search_params = {
			...{ page: page },
			...search_query,
			...search_filters,
		};
		const params = getQueryParams(provider, search_params);
		const url = buildURL('search', params);

		// Create fetch request.
		const response = await fetch(url);
		const { status, headers } = response;
		checkRateLimit(headers);

		try {
			// Get response data.
			const data = await response.json();
			const results = getResults(data);

			// Check returned data.
			total_results = getSearchTotal(data);

			checkTotalResults(results.length);

			// Hide search filters if no results and not filtering.
			show_search_filters = total_results < 2 && isObjectEmpty(search_filters) ? false : true;

			// Update Props.
			results = results;
			setState({
				results: results,
				search_filters: FILTERS[provider].search,
			});

			// Delay for effect.
			setTimeout(function () {
				photoSearch.current.classList.remove('searching');
				photoTarget.current.classList.remove('loading');
				isLoading = false;
			}, delay);
		} catch (error) {
			// Reset all search parameters.
			isDone = true;
			isLoading = false;
			show_search_filters = false;
			total_results = 0;
			photoSearch.current.classList.remove('searching');
			photoTarget.current.classList.remove('loading');

			// Update Props.
			results = [];
			setState({ results: results });
			consoleStatus(provider, status);
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
	async function getPhotos(view, reset = false, switcher = false) {
		if (isLoading && !reset) {
			return;
		}

		const self = this;
		photoTarget.current.classList.add('loading');
		isLoading = true;
		page = 1;
		orderby = view;
		results = [];
		clearSearch();

		// Build URL.
		const params = getQueryParams(provider, filters);
		const url = buildURL('photos', params);

		// Create fetch request.
		const response = await fetch(url);
		const { status, headers } = response;
		checkRateLimit(headers);

		// Status OK.
		try {
			const data = await response.json();
			const { error = null } = data; // Get error reporting.

			const results = getResults(data);

			checkTotalResults(results.length); // Check for returned data.
			results = results; // Update Props.
			api_error = error;

			// Set results state.
			if (!switcher) {
				setState({
					results: results,
				});
			} else {
				setState({
					results: results,
					filters: FILTERS[provider].filters,
				});
			}
		} catch (error) {
			consoleStatus(provider, status);
			photoTarget.current.classList.remove('loading');
			isLoading = false;
		}

		// Delay loading animatons for effect.
		setTimeout(function () {
			photoTarget.current.classList.remove('loading');
			isLoading = false;
		}, delay);
	}

	/**
	 * Load next set of photos in infinite scroll style.
	 *
	 * @since 3.0
	 */
	async function loadMorePhotos() {
		container.classList.add('loading');
		isLoading = true;
		page = parseInt(page) + 1;

		// Get search query.
		let search_query = {};
		if (is_search) {
			search_query = {
				term: search_term,
			};
		}

		// Build URL.
		const type = is_search ? 'search' : 'photos';
		const filters = is_search ? search_filters : filters;
		const loadmore_params = {
			...{ page: page },
			...search_query,
			...filters,
		};
		const params = getQueryParams(provider, loadmore_params);
		const url = buildURL(type, params);

		// Create fetch request.
		const response = await fetch(url);
		const { status, headers } = response;
		checkRateLimit(headers);

		try {
			const data = await response.json();
			let results = getResults(data);

			// Loop result & push items into array.
			results &&
				results.map((data) => {
					results.push(data);
				});

			// Check the total results.
			checkTotalResults(results.length);

			// Set results state.
			setState({ results: results });
		} catch (error) {
			consoleStatus(provider, status);
			isLoading = false;
		}
	}

	/**
	 * Filter the photo listing.
	 *
	 * @param {string} filter The current filter key.
	 * @param {string} value  The value to filter.
	 */
	function filterPhotos(filter, value) {
		if ((filters[filter] && value === '#') || value === '' || value === 'all') {
			delete filters[filter];
		} else {
			filters[filter] = value;
		}
		getPhotos(view, true);
	}

	/**
	 * Filter the search results.
	 *
	 * @param {string} filter The current filter key.
	 * @param {string} value  The value to filter.
	 */
	function filterSearch(filter, value) {
		if ((search_filters[filter] && value === '#') || value === '' || value === 'all') {
			delete search_filters[filter];
		} else {
			search_filters[filter] = value;
		}
		doSearch(search_term);
	}

	/**
	 * Toggle the active state of all filters.
	 */
	function toggleFilters() {
		const filters = filterGroups.current.querySelectorAll('button.filter-dropdown--button');
		if (filters) {
			filters.forEach((button) => {
				button.disabled = is_search ? true : false;
			});
		}
		if (is_search) {
			filterGroups.current.classList.add('inactive');
		} else {
			filterGroups.current.classList.remove('inactive');
		}
	}

	/**
	 * Callback after activating and verififying an API key.
	 *
	 * @param {string} provider The verified provider.
	 * @since 4.5
	 */
	function afterVerifiedAPICallback(provider) {
		const button = providerNav.current.querySelector(`button[data-provider=${provider}]`);
		if (!button) {
			return;
		}
		setState({ api_lightbox: false }); // Close the lightbox.
		document.body.classList.remove('overflow-hidden');
		button.click();
	}

	/**
	 * Close the API Lightbox.
	 *
	 * @param {string} provider The previous provider.
	 */
	function closeAPILightbox(provider) {
		setState({ api_lightbox: false }); // Close the lightbox.
		document.body.classList.remove('overflow-hidden');

		// Set focus on previous provider button.
		const target = providerNav.current.querySelector(`button[data-provider=${provider}]`);
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
	async function switchProvider(e) {
		const target = e.currentTarget;
		const newProvider = target.dataset.provider;

		if (newProvider === provider) {
			return false; // Exit if already selected.
		}

		// API Checker.
		// Bounce if API key for provider is invalid.
		if (API[newProvider].requires_key) {
			const self = this;
			try {
				const response = await fetch(buildTestURL(newProvider));
				const { status, headers } = response;
				checkRateLimit(headers);

				if (status !== 200) {
					// Catch API errors and 401s.
					setState({ api_lightbox: newProvider }); // Show API Lightbox.
					document.body.classList.add('overflow-hidden');
					return;
				}
			} catch (error) {
				// Catch all other errors.
				setState({ api_lightbox: provider }); // Show API Lightbox.
				document.body.classList.add('overflow-hidden');
				return;
			}
		}

		// Remove active from buttons.
		providerNav.current.querySelectorAll('button').forEach((button) => {
			button.classList.remove('active');
		});

		// Select active button.
		target.classList.add('active');

		// Update API provider params.
		provider = newProvider;
		api_provider = API[provider];
		api_key = instant_img_localize[`${provider}_app_id`];
		photo_api = api_provider?.photo_api;
		search_api = api_provider?.search_api;

		// Clear all filters.
		filters = {};
		search_filters = {};

		// Finally, fetch the photos.
		view = 'latest';
		getPhotos(view, true, true);
	}

	/**
	 * Renders the Masonry layout.
	 *
	 * @since 3.0
	 */
	function renderLayout() {
		if (is_block_editor) {
			return false;
		}
		const self = this;
		const photoListWrapper = photoTarget.current;
		imagesLoaded(photoListWrapper, function () {
			msnry = new Masonry(photoListWrapper, {
				itemSelector: '.photo',
			});
			photoTarget.current.querySelectorAll('.photo').forEach((el) => {
				el.classList.add('in-view');
			});
		});
	}

	/**
	 * Scrolling function.
	 *
	 * @since 3.0
	 */
	function onScroll() {
		const wHeight = window.innerHeight;
		const scrollTop = window.pageYOffset;
		const scrollH = document.body.scrollHeight - 200;
		if (wHeight + scrollTop >= scrollH && !isLoading && !isDone) {
			loadMorePhotos();
		}
	}

	/**
	 * A checker to determine if there are remaining search results.
	 *
	 * @param {number} num Total search results.
	 * @since 3.0
	 */
	function checkTotalResults(num) {
		isDone = parseInt(num) === 0 || num === undefined ? true : false;
	}

	/**
	 * Sets the loading state.
	 *
	 * @since 3.0
	 */
	function doneLoading() {
		const self = this;
		setTimeout(function () {
			isLoading = false;
			container.classList.remove('loading');
		}, delay);
	}

	/**
	 * Show the tooltip.
	 *
	 * @param {Event} e The clicked element event.
	 * @since 4.3.0
	 */
	function showTooltip(e) {
		const target = e.currentTarget;
		const rect = target.getBoundingClientRect();
		let left = Math.round(rect.left);
		const top = Math.round(rect.top);
		const tooltip = container.querySelector('#tooltip');
		tooltip.classList.remove('over');

		if (target.classList.contains('tooltip--above')) {
			tooltip.classList.add('above');
		} else {
			tooltip.classList.remove('above');
		}

		// Delay Tooltip Reveal.
		tooltipInterval = setInterval(function () {
			clearInterval(tooltipInterval);
			tooltip.innerHTML = target.dataset.title; // Tooltip content.

			// Position Tooltip.
			left = left - tooltip.offsetWidth + target.offsetWidth + 5;
			tooltip.style.left = `${left}px`;
			tooltip.style.top = `${top}px`;

			setTimeout(function () {
				tooltip.classList.add('over');
			}, delay);
		}, 750);
	}

	/**
	 * Hide the tooltip.
	 *
	 * @since 4.3.0
	 */
	function hideTooltip() {
		clearInterval(tooltipInterval);
		const tooltip = container.querySelector('#tooltip');
		tooltip.classList.remove('over');
	}

	/**
	 * Test access to the REST API.
	 *
	 * @since 3.2
	 */
	function test() {
		const self = this;
		const testURL = instant_img_localize.root + 'instant-images/test/'; // REST Route
		const restAPITest = new XMLHttpRequest();
		restAPITest.open('POST', testURL, true);
		restAPITest.setRequestHeader('X-WP-Nonce', instant_img_localize.nonce);
		restAPITest.setRequestHeader('Content-Type', 'application/json');
		restAPITest.send();
		restAPITest.onload = function () {
			if (restAPITest.status >= 200 && restAPITest.status < 400) {
				const response = JSON.parse(restAPITest.response);
				const success = response.success;
				if (!success) {
					setState({ restapi_error: true });
				}
			} else {
				// Error
				setState({ restapi_error: true });
			}
		};
		restAPITest.onerror = function (errorMsg) {
			console.warn(errorMsg);
			setState({ restapi_error: true });
		};
	}

	/**
	 * Escape handler to close edit windows on photos.
	 *
	 * @param {Event} e The key event.
	 */
	function escFunction(e) {
		const { key } = e;
		if (key === 'Escape') {
			const editing = photoTarget.current.querySelectorAll('.edit-screen.editing');
			if (editing) {
				[...editing].forEach((element) => {
					element && element.classList.remove('editing');
				});
			}
		}
	}

	// Component Updated.
	// componentDidUpdate() {
	// 	renderLayout();
	// 	doneLoading();
	// }

	useEffect(() => {
		renderLayout();
		doneLoading();
		test();
		container.classList.remove('loading');
		wrapper.classList.add('loaded');

		// Not Gutenberg and Media Popup add scroll listener.
		if (!is_block_editor && !is_media_router) {
			window.addEventListener('scroll', () => onScroll());
		}

		// Add escape listener.
		document.addEventListener('keydown', escFunction, false);
	}, []);

	return (
		<div id="photo-listing" className={provider}>
			{!!providers?.length && (
				<nav className="provider-nav" ref={providerNav}>
					{providers.map((provider, iterator) => (
						<div key={`provider-${iterator}`}>
							<button
								data-provider={provider.toLowerCase()}
								onClick={(e) => switchProvider(e)}
								className={provider === provider.toLowerCase() ? 'provider-nav--btn active' : 'provider-nav--btn'}
							>
								<span>{provider}</span>
								{API[provider.toLowerCase()].new && <span className="provider-nav--new">{instant_img_localize.new}</span>}
							</button>
						</div>
					))}
				</nav>
			)}

			{state.api_lightbox && (
				<APILightbox
					provider={state.api_lightbox}
					afterVerifiedAPICallback={afterVerifiedAPICallback.bind(this)}
					closeAPILightbox={closeAPILightbox.bind(this)}
				/>
			)}

			<div className="control-nav" ref={controlNav}>
				<div className={classNames('control-nav--filters-wrap', api_error ? 'inactive' : null)} ref={filterGroups}>
					{Object.entries(state.filters).length ? (
						<div className="control-nav--filters">
							{Object.entries(state.filters).map(([key, filter], i) => (
								<Filter key={`${key}-${provider}-${i}`} filterKey={key} provider={provider} data={filter} function={filterPhotos.bind(this)} />
							))}
						</div>
					) : null}
				</div>

				<div className={classNames('control-nav--search', 'search-field', api_error ? 'inactive' : null)} id="search-bar">
					<form onSubmit={(e) => search(e)} autoComplete="off">
						<label htmlFor="photo-search" className="offscreen">
							{instant_img_localize.search_label}
						</label>
						<input type="search" id="photo-search" placeholder={instant_img_localize.search} ref={photoSearch} disabled={api_error} />
						<button type="submit" id="photo-search-submit" disabled={api_error}>
							<i className="fa fa-search"></i>
						</button>
						<ResultsToolTip
							container={container}
							getPhotos={getPhotos.bind(this)}
							isSearch={is_search}
							total={total_results}
							title={`${total_results} ${instant_img_localize.search_results} ${search_term}`}
						/>
					</form>
				</div>
			</div>

			{state.restapi_error && <RestAPIError title={instant_img_localize.error_restapi} desc={instant_img_localize.error_restapi_desc} type="warning" />}

			{is_search && editor !== 'gutenberg' && (
				<div className="search-results-header">
					<h2>{search_term.replace('id:', 'ID: ')}</h2>
					<div className="search-results-header--text">
						{`${total_results} ${instant_img_localize.search_results}`} <strong>{`${search_term}`}</strong>
						{' - '}
						<button title={instant_img_localize.clear_search} onClick={() => getPhotos('latest')}>
							{instant_img_localize.clear_search}
						</button>
					</div>
					{show_search_filters && Object.entries(state.search_filters).length && (
						<div className="control-nav--filters-wrap">
							<div className="control-nav--filters">
								{Object.entries(state.search_filters).map(([key, filter], index) => (
									<Filter
										ref={(ref) => (filterRef[index] = ref)}
										key={`${key}-${index}`}
										filterKey={key}
										provider={provider}
										data={filter}
										function={filterSearch}
									/>
								))}
							</div>
						</div>
					)}
				</div>
			)}

			<div id="photos" className="photo-target" ref={photoTarget}>
				{state.results.length
					? state.results.map((result, iterator) => (
							<Fragment key={`${provider}-${result.id}-${iterator}`}>
								{result && result.type && result.type === 'instant-images-ad' ? (
									<Sponsor result={result} />
								) : (
									<Photo
										provider={provider}
										result={result}
										mediaRouter={is_media_router}
										blockEditor={is_block_editor}
										setFeaturedImage={setFeaturedImage}
										insertImage={insertImage}
										showTooltip={showTooltip}
										hideTooltip={hideTooltip}
									/>
								)}
							</Fragment>
					  ))
					: null}
			</div>
			{total_results < 1 && is_search === true && <NoResults total={total_results} is_search={is_search} />}
			<LoadingBlock />
			<LoadMore loadMorePhotos={loadMorePhotos} />
			<ErrorLightbox error={api_error} provider={provider} />
			<Tooltip />
		</div>
	);
}
