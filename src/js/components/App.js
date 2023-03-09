import { useRef, useState, useEffect } from '@wordpress/element';
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
import NoResults from './NoResults';
import RestAPIError from './RestAPIError';
import ResultsToolTip from './ResultsToolTip';
import Tooltip from './Tooltip';
import ProviderNav from './ProviderNav';
import Photos from './Photos';
const imagesLoaded = require('imagesloaded');
import { useInView } from 'react-intersection-observer';
let page = 1;

/**
 * Render the InstantImages component.
 *
 * @param {Object} props The component props.
 * @return {JSX.Element} The InstantImages component.
 */
export default function App(props) {
	let { editor = 'classic', data, error, provider, container, setFeaturedImage, insertImage } = props;

	let api_provider = API[provider]; // The API settings for the provider.
	const per_page = API.defaults.per_page;

	// API Vars.
	let api_key = instant_img_localize[`${provider}_app_id`];
	let photo_api = api_provider?.photo_api;
	let search_api = api_provider?.search_api;
	let api_error = error;

	const loadingClass = 'loading';
	const searchClass = 'searching';

	// App state.
	const mounted = useRef(false);
	const [results, setResults] = useState(getResults(data));
	const [activeProvider, setActiveProvider] = useState(provider);
	const [loading, setLoading] = useState(true);
	const [done, setDone] = useState(false);

	const [state, setState] = useState({
		provider: provider,
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
	let msnry = '';
	let tooltipInterval = '';
	const delay = 250;

	// Refs.
	const [loadMoreRef, inView] = useInView({
		rootMargin: '0px 0px',
	});
	const photoTarget = useRef();
	const controlNav = useRef();
	const photoSearch = useRef();
	const filterGroups = useRef();
	const filterRef = [];

	// Editor props.
	const is_block_editor = editor === 'gutenberg' ? true : false;
	const is_media_router = editor === 'media-router' ? true : false;
	const plugin = is_block_editor ? document.body : container.parentNode.parentNode;
	const wrapper = is_block_editor ? document.body : plugin.querySelector('.instant-images-wrapper');

	/**
	 * Reset filters.
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
			input.classList.add(searchClass);
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
	 * Perform a photo search.
	 *
	 * @param {string} term The search term.
	 * @since 3.0
	 */
	async function doSearch(term) {
		const search_type = term.substring(0, 3) === 'id:' ? 'id' : 'term';

		// Set loading variables and options.
		photoTarget.current.classList.add(loadingClass);
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
			const images = getResults(data);

			// Check returned data.
			total_results = getSearchTotal(data);

			checkTotalResults(images.length);

			// Hide search filters if no results and not filtering.
			show_search_filters = total_results < 2 && isObjectEmpty(search_filters) ? false : true;

			// Update Props.
			setState({
				results: images,
				search_filters: FILTERS[provider].search,
			});

			// Delay for effect.
			setTimeout(function () {
				photoSearch.current.classList.remove(searchClass);
				photoTarget.current.classList.remove(loadingClass);
			}, delay);
		} catch (error) {
			// Reset all search parameters.
			setDone(true);
			setLoading(false);
			show_search_filters = false;
			total_results = 0;
			photoSearch.current.classList.remove(searchClass);
			photoTarget.current.classList.remove(loadingClass);

			// Update Props.
			setState({ results: results });
			consoleStatus(provider, status);
		}
	}

	/**
	 * Get the initial set of photos for the current view (New/Popular/Filters/etc...).
	 *
	 * @param {Boolean} reset    Is this an app reset.
	 * @param {Boolean} switcher Is this a provider switch.
	 * @since 3.0
	 */
	async function getPhotos(reset = false, switcher = false) {
		if (loading && !reset) {
			// Exit if loading and not an app reset
			return;
		}

		setLoading(true); // Set loading state.
		clearSearch(); // Clear search results.
		page = 1;

		// Build URL.
		const params = getQueryParams(activeProvider, filters);
		const url = buildURL('photos', params);

		// Create fetch request.
		const response = await fetch(url);
		const { status, headers } = response;
		checkRateLimit(headers);

		// Status OK.
		try {
			const data = await response.json();
			const { error = null } = data; // Get error reporting.
			const images = getResults(data);
			checkTotalResults(images.length); // Check for returned data.
			api_error = error;

			// Set results state.
			if (!switcher) {
				setResults((prevState) => [...prevState, ...images]); // Push images into state.
			} else {
				setResults(images); // Push images into state.
			}
		} catch (error) {
			consoleStatus(provider, status);
			setLoading(false);
		}

		// Delay loading animatons for effect.
		setTimeout(function () {
			setLoading(false);
		}, delay);
	}

	/**
	 * Load next set of photos in infinite scroll style.
	 *
	 * @since 3.0
	 */
	async function loadMorePhotos() {
		setLoading(true);
		page = parseInt(page) + 1;

		// Get search query.
		const search_query = is_search ? { term: search_term } : {};

		// Build URL.
		const type = is_search ? 'search' : 'photos';
		const filters = is_search ? search_filters : filters;
		const loadmore_params = {
			...{ page: page },
			...search_query,
			...filters,
		};
		const params = getQueryParams(activeProvider, loadmore_params);
		const url = buildURL(type, params);

		// Create fetch request.
		const response = await fetch(url);
		const { status, headers } = response;
		checkRateLimit(headers);

		try {
			const data = await response.json();
			const images = getResults(data);
			checkTotalResults(images.length); // Check the total results.
			setResults((prevState) => [...prevState, ...images]); // Push images into state.
		} catch (error) {
			consoleStatus(provider, status);
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
		getPhotos(true);
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
		setActiveProvider(provider); // Set the active provider.
		setState({ api_lightbox: false }); // Close the lightbox.
		document.body.classList.remove('overflow-hidden');
	}

	/**
	 * Close the API Lightbox.
	 * @since 4.5
	 */
	function closeAPILightbox() {
		setState({ api_lightbox: false }); // Close the lightbox.
		document.body.classList.remove('overflow-hidden');
	}

	/**
	 * Switch API providers.
	 *
	 * @param {Event} e The clicked element event.
	 * @since 4.5
	 */
	async function switchProvider(e) {
		const target = e.currentTarget;
		const provider = target.dataset.provider;

		if (target.classList.contains('active')) {
			// Exit if already active.
			return;
		}

		// API Verification.
		// Note: Bounce user if provider API key is not valid.
		if (API[provider].requires_key) {
			try {
				const response = await fetch(buildTestURL(provider));
				const { status, headers } = response;
				checkRateLimit(headers);

				if (status !== 200) {
					// Catch API errors and 401s.
					setState({ api_lightbox: provider }); // Show API Lightbox.
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

		// GO forward and toggle the providers.
		photoTarget.current.classList.add(loadingClass);
		setTimeout(() => {
			// Delay for effect.
			setActiveProvider(provider);
		}, 150);

		// Update API provider params.

		// api_provider = API[provider];
		// api_key = instant_img_localize[`${provider}_app_id`];
		// photo_api = api_provider?.photo_api;
		// search_api = api_provider?.search_api;

		// // Clear all filters.
		// filters = {};
		// search_filters = {};

		// // Finally, fetch the photos.
		// view = 'latest';
		// getPhotos(view, true, true);
	}

	useEffect(() => {
		if (!mounted.current) {
			return;
		}
		getPhotos(true, true);
	}, [activeProvider]);

	/**
	 * Renders the Masonry layout.
	 *
	 * @since 3.0
	 */
	function renderLayout() {
		if (is_block_editor) {
			setLoading(false);
			return false;
		}
		imagesLoaded(photoTarget.current, function () {
			msnry = new Masonry(photoTarget.current, {
				itemSelector: '.photo',
			});
			photoTarget.current.querySelectorAll('.photo').forEach((el) => {
				el.classList.add('in-view');
			});
			setLoading(false);
		});
	}

	/**
	 * A checker to determine if there are remaining search results.
	 *
	 * @param {number} num Total search results.
	 * @since 3.0
	 */
	function checkTotalResults(num) {
		setDone(parseInt(num) === 0 || num === undefined);
	}

	/**
	 * Test access to the REST API.
	 *
	 * @since 3.2
	 */
	function test() {
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

	useEffect(() => {
		if (mounted.current && !loading && !done) {
			loadMorePhotos();
		}
	}, [inView]); // eslint-disable-line react-hooks/exhaustive-deps

	// Loading flag.
	useEffect(() => {
		if (loading) {
			plugin.classList.add(loadingClass);
		} else {
			photoTarget.current.classList.remove(loadingClass);
			plugin.classList.remove(loadingClass);
		}
	}, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

	// Results update.
	useEffect(() => {
		renderLayout();
	}, [results]); // eslint-disable-line react-hooks/exhaustive-deps

	// Page load.
	useEffect(() => {
		test();
		plugin.classList.remove(loadingClass);
		wrapper.classList.add('loaded');
		document.addEventListener('keydown', escFunction, false); // Add global escape listener.
		mounted.current = true;
	}, []);

	return (
		<div id="photo-listing">
			<ProviderNav switchProvider={switchProvider} provider={activeProvider} />

			{state.api_lightbox && (
				<APILightbox provider={state.api_lightbox} afterVerifiedAPICallback={afterVerifiedAPICallback} closeAPILightbox={closeAPILightbox} />
			)}

			<div className="control-nav" ref={controlNav}>
				<div className={classNames('control-nav--filters-wrap', api_error ? 'inactive' : null)} ref={filterGroups}>
					{state?.filters && Object.entries(state.filters)?.length ? (
						<div className="control-nav--filters">
							{Object.entries(state.filters).map(([key, filter], i) => (
								<Filter key={`${key}-${provider}-${i}`} filterKey={key} provider={provider} data={filter} function={filterPhotos} />
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
							container={plugin}
							getPhotos={getPhotos}
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
						<button title={instant_img_localize.clear_search} onClick={() => getPhotos()}>
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

			<div id="photos" ref={photoTarget}>
				<Photos
					provider={activeProvider}
					results={results}
					mediaRouter={is_media_router}
					blockEditor={is_block_editor}
					setFeaturedImage={setFeaturedImage}
					insertImage={insertImage}
				/>
			</div>

			{total_results < 1 && is_search === true && <NoResults total={total_results} is_search={is_search} />}
			<LoadingBlock />
			<div className="load-more-wrap" ref={loadMoreRef}>
				<button type="button" className="button" onClick={() => loadMorePhotos()}>
					{instant_img_localize.load_more}
				</button>
			</div>
			<ErrorLightbox error={api_error} provider={provider} />
			<Tooltip />
		</div>
	);
}
