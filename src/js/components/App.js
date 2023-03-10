import { useRef, useState, useEffect, Fragment } from '@wordpress/element';
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
 * Fix bug with double searching after No Results. The issue is the inview flag and loadmorephotos is being fired.
 * Fix issue with double loading on initial plugin render. Issue is the loadmore is triggering after the first renderlayout();
/*

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

	const searchClass = 'searching';
	const filters = {};

	// App state.
	const mounted = useRef(false);
	const [results, setResults] = useState(getResults(data));
	const [activeProvider, setActiveProvider] = useState(provider);
	const [loading, setLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [done, setDone] = useState(false);
	const [showAPILightbox, setShowAPILightbox] = useState(false);

	const [search, setSearch] = useState({
		active: false,
		term: '',
		results: 0,
	});

	const [filterOptions, setFilterOptions] = useState({
		default: FILTERS[activeProvider].filters,
		search: FILTERS[activeProvider].search,
	});

	let search_filters = {};
	let show_search_filters = true;
	let msnry = '';
	let tooltipInterval = '';
	const delay = 250;

	// Refs.
	const [loadMoreRef, inView] = useInView({
		rootMargin: '0px 0px',
	});
	const photoTarget = useRef();
	const controlNav = useRef();
	const searchInput = useRef();
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
	 * Handle the Photo Search.
	 *
	 * @param {Event} event The dispatched submit event.
	 * @since 3.0
	 */
	function searchHandler(event) {
		event.preventDefault();
		const term = searchInput.current.value;
		resetFilters();
		if (term.length > 2) {
			searchInput.current.classList.add(searchClass);
			search_filters = {};
			doSearch(term);
		} else {
			searchInput.current.focus();
		}
	}

	/**
	 * Reset search results, settings and results view.
	 *
	 * @since 3.0
	 */
	function clearSearch() {
		searchInput.current.value = '';
		setSearch({
			active: false,
			term: '',
			results: 0,
		});
		search_filters = {}; // Reset search filters.
		toggleFilters(); // Re-enable filters.
	}

	/**
	 * Perform a photo search.
	 *
	 * @param {string} term Search term.
	 * @since 3.0
	 */
	async function doSearch(term) {
		setLoading(true);
		toggleFilters(); // Disable filters.
		page = 1; // Reset current page num.

		const search_type = term.substring(0, 3) === 'id:' ? 'id' : 'term';

		// Get search query.
		let search_query = {};
		if (search_type === 'id') {
			show_search_filters = false;
			search_query = {
				id: term.replace('id:', '').replace(/\s+/, ''),
			};
		} else {
			show_search_filters = true;
			search_query = {
				term: term,
			};
		}

		// Build URL.
		const search_params = {
			...{ page: page },
			...search_query,
			...search_filters,
		};
		const params = getQueryParams(activeProvider, search_params);
		const url = buildURL('search', params);

		// Create fetch request.
		const response = await fetch(url);
		const { status, headers } = response;
		checkRateLimit(headers);

		try {
			// Get response data.
			const data = await response.json();
			const images = getResults(data);
			checkTotalResults(images.length);
			setResults(images);

			// Check returned data.
			const total_results = getSearchTotal(data);

			setSearch({
				active: true,
				term: term,
				results: total_results,
			});

			// Hide search filters if no results and not filtering.
			show_search_filters = total_results < 2 && isObjectEmpty(search_filters) ? false : true;

			// Update Props.
			setState({
				search_filters: FILTERS[provider].search,
			});
		} catch (error) {
			// Reset all search parameters.
			setDone(true);
			setLoading(false);
			show_search_filters = false;
			consoleStatus(provider, status);
		}

		searchInput.current.classList.remove(searchClass);
	}

	/**
	 * Get the initial set of photos for the current view (New/Popular/Filters/etc...).
	 *
	 * @since 3.0
	 */
	async function getPhotos() {
		if (loadingMore) {
			return false;
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
			checkTotalResults(images.length);
			setResults(images);
			api_error = error;
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
		if (loading || loadingMore) {
			return;
		}

		setLoadingMore(true);
		page = parseInt(page) + 1;

		// Get search query.
		const search_query = search?.active && search?.term ? { term: search.term } : {};

		// Build URL.
		const type = search?.active ? 'search' : 'photos';
		const filters = search?.active ? search_filters : filters;
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
			checkTotalResults(images.length);
			setResults((prevState) => [...prevState, ...images]);
		} catch (error) {
			consoleStatus(provider, status);
			setLoadingMore(false);
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
		getPhotos();
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
		doSearch(search?.term);
	}

	/**
	 * Toggle the active state of all filters.
	 */
	function toggleFilters() {
		const filters = filterGroups.current.querySelectorAll('button.filter-dropdown--button');
		if (filters) {
			filters.forEach((button) => {
				button.disabled = search?.active ? true : false;
			});
		}
		if (search?.active) {
			filterGroups.current.classList.add('inactive');
		} else {
			filterGroups.current.classList.remove('inactive');
		}
	}

	/**
	 * Close the API Lightbox.
	 *
	 * @param {string} provider The provider to close the lightbox for.
	 * @since 4.5
	 */
	function closeAPILightbox(provider = null) {
		if (provider) {
			setActiveProvider(provider);
		}
		setShowAPILightbox(false);
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

		setLoading(true);

		// API Verification.
		// Note: Bounce user if provider API key is not valid.
		if (API[provider].requires_key) {
			try {
				const response = await fetch(buildTestURL(provider));
				const { status, headers } = response;
				checkRateLimit(headers);

				if (status !== 200) {
					// Catch API errors and 401s.
					setShowAPILightbox(provider); // Show API Lightbox.
					document.body.classList.add('overflow-hidden');
					return;
				}
			} catch (error) {
				// Catch all other errors.
				setShowAPILightbox(provider); // Show API Lightbox.
				document.body.classList.add('overflow-hidden');
				return;
			}
		}

		// Update filter options.
		setFilterOptions({
			default: FILTERS[provider].filters,
			search: FILTERS[provider].search,
		});

		// Switch the provider.
		setActiveProvider(provider);
	}

	/**
	 * Renders the Masonry layout.
	 *
	 * @since 3.0
	 */
	function renderLayout() {
		if (is_block_editor) {
			setTimeout(() => {
				// Delay to allow for rendering and set up.
				setLoading(false);
				setLoadingMore(false);
			}, delay);

			return false;
		}

		imagesLoaded(photoTarget.current, function () {
			msnry = new Masonry(photoTarget.current, {
				itemSelector: '.photo',
			});
			photoTarget.current.querySelectorAll('.photo').forEach((el) => {
				el.classList.add('in-view');
			});
			setTimeout(() => {
				// Delay to allow for rendering and set up.
				setLoading(false);
				setLoadingMore(false);
			}, delay);
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

	// Provider switch callback.
	useEffect(() => {
		if (!mounted.current) {
			return;
		}
		getPhotos();
	}, [activeProvider]);

	// Scroll in-view callback.
	useEffect(() => {
		if (mounted.current && !loading && !done) {
			loadMorePhotos();
		}
	}, [inView]); // eslint-disable-line react-hooks/exhaustive-deps

	// Results callback.
	useEffect(() => {
		renderLayout();
	}, [results]); // eslint-disable-line react-hooks/exhaustive-deps

	// Initial page load.
	useEffect(() => {
		setLoading(false);
		wrapper.classList.add('loaded');
		document.addEventListener('keydown', escFunction, false); // Add global escape listener.
		mounted.current = true;
		return () => {
			document.removeEventListener('keydown', escFunction, false);
			mounted.current = false;
		};
	}, []);

	return (
		<Fragment>
			<ProviderNav switchProvider={switchProvider} provider={activeProvider} />
			<RestAPIError title={instant_img_localize.error_restapi} desc={instant_img_localize.error_restapi_desc} type="warning" />

			<div className="control-nav" ref={controlNav}>
				<div className={classNames('control-nav--filters-wrap', api_error ? 'inactive' : null)} ref={filterGroups}>
					{filterOptions?.default && Object.entries(filterOptions.default)?.length ? (
						<div className="control-nav--filters">
							{Object.entries(filterOptions.default).map(([key, filter], index) => (
								<Filter key={`${activeProvider}-${index}-${key}`} provider={activeProvider} data={filter} filterKey={key} function={filterPhotos} />
							))}
						</div>
					) : null}
				</div>
				<div className={classNames('control-nav--search', 'search-field', api_error ? 'inactive' : null)} id="search-bar">
					<form onSubmit={(e) => searchHandler(e)} autoComplete="off">
						<label htmlFor="search-input" className="offscreen">
							{instant_img_localize.search_label}
						</label>
						<input type="search" id="search-input" placeholder={instant_img_localize.search} ref={searchInput} disabled={api_error} />
						<button type="submit" disabled={api_error}>
							<i className="fa fa-search"></i>
						</button>
						<ResultsToolTip
							container={plugin}
							getPhotos={getPhotos}
							is_search={search?.active}
							total={search?.results}
							title={`${search?.results} ${instant_img_localize.search_results} ${search?.term}`}
						/>
					</form>
				</div>
			</div>

			<div id="photo-listing" className={loading ? 'loading' : null}>
				{search?.active && editor !== 'gutenberg' && (
					<div className="search-results-header">
						<h2>{search?.term.replace('id:', 'ID: ')}</h2>
						<div className="search-results-header--text">
							{`${search?.results} ${instant_img_localize.search_results}`} <strong>{`${search?.term}`}</strong>
							{' - '}
							<button title={instant_img_localize.clear_search} onClick={() => getPhotos(true)}>
								{instant_img_localize.clear_search}
							</button>
						</div>
						{filterOptions?.search && Object.entries(filterOptions.search).length && (
							<div className="control-nav--filters-wrap">
								<div className="control-nav--filters">
									{Object.entries(filterOptions.search).map(([key, filter], index) => (
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

				<LoadingBlock loading={loadingMore} />
				<NoResults total={search?.results} is_search={search?.active} />
				<div className="load-more-wrap" ref={loadMoreRef}>
					<button type="button" className="button" onClick={() => loadMorePhotos()}>
						{instant_img_localize.load_more}
					</button>
				</div>
				<APILightbox provider={showAPILightbox} closeAPILightbox={closeAPILightbox} />
				<ErrorLightbox error={api_error} provider={activeProvider} />
				<Tooltip />
			</div>
		</Fragment>
	);
}
