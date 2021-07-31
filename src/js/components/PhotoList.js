import Masonry from 'masonry-layout';
import React from 'react';
import API from './API';
import Photo from './Photo';
import ResultsToolTip from './ResultsToolTip';
const imagesLoaded = require('imagesloaded');

class PhotoList extends React.Component {
	constructor(props) {
		super(props);

		this.results = this.props.results ? this.props.results : [];
		this.state = { results: this.results };

		this.service = this.props.service; // Unsplash, Pixabay, etc.
		this.orderby = this.props.orderby; // Orderby
		this.page = this.props.page; // Page

		this.is_search = false;
		this.search_term = '';
		this.total_results = 0;
		this.orientation = '';

		this.isLoading = false; // loading flag
		this.isDone = false; // Done flag - no photos remain

		this.errorMsg = '';
		this.msnry = '';
		this.tooltipInterval = '';

		this.editor = this.props.editor ? this.props.editor : 'classic';
		this.is_block_editor = this.props.editor === 'gutenberg' ? true : false;
		this.is_media_router = this.props.editor === 'media-router' ? true : false;
		this.SetFeaturedImage = this.props.SetFeaturedImage ? this.props.SetFeaturedImage.bind(this) : '';
		this.InsertImage = this.props.InsertImage ? this.props.InsertImage.bind(this) : '';

		if (this.is_block_editor) {
			// Gutenberg Sidebar Only
			this.container = document.querySelector('body');
			this.container.classList.add('loading');
			this.wrapper = document.querySelector('body');
		} else {
			// Post Edit Screens and Plugin Screen
			this.container = this.props.container.closest('.instant-img-container');
			this.wrapper = this.props.container.closest('.instant-images-wrapper');
			this.container.classList.add('loading');
		}
	}

	/**
	 * Test access to the REST API.
	 *
	 * @since 3.2
	 */
	test() {
		let self = this;

		let target = this.container.querySelector('.error-messaging'); // Target element

		let testURL = instant_img_localize.root + 'instant-images/test/'; // REST Route
		var restAPITest = new XMLHttpRequest();
		restAPITest.open('POST', testURL, true);
		restAPITest.setRequestHeader('X-WP-Nonce', instant_img_localize.nonce);
		restAPITest.setRequestHeader('Content-Type', 'application/json');
		restAPITest.send();

		restAPITest.onload = function () {
			if (restAPITest.status >= 200 && restAPITest.status < 400) {
				// Success

				let response = JSON.parse(restAPITest.response);
				let success = response.success;

				if (!success) {
					self.renderTestError(target);
				}
			} else {
				// Error
				self.renderTestError(target);
			}
		};

		restAPITest.onerror = function (errorMsg) {
			console.log(errorMsg);
			self.renderTestError(errorTarget);
		};
	}

	renderTestError(target) {
		target.classList.add('active');
		target.innerHTML = instant_img_localize.error_restapi + instant_img_localize.error_restapi_desc;
	}

	/**
	 * Trigger Search.
	 *
	 * @param {Event} event The dispatched submit event.
	 * @since 3.0
	 */
	search(event) {
		event.preventDefault();
		let input = this.container.querySelector('#photo-search');
		let term = input.value;

		if (term.length > 2) {
			input.classList.add('searching');
			this.container.classList.add('loading');
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

			if (target.classList.contains('active')) {
				// Clear orientation
				target.classList.remove('active');
				this.orientation = '';
			} else {
				// Set orientation
				let siblings = target.parentNode.querySelectorAll('li');
				[...siblings].forEach((el) => el.classList.remove('active')); // remove active classes

				target.classList.add('active');
				this.orientation = orientation;
			}

			if (this.search_term !== '') {
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
		return this.orientation === '' ? false : true;
	}

	/**
	 * Clear the orientation.
	 *
	 * @since 4.2
	 */
	clearOrientation() {
		const items = this.container.querySelectorAll('.orientation-list li');
		[...items].forEach((el) => el.classList.remove('active')); // remove active classes
		this.orientation = '';
	}

	/**
	 * Run the search.
	 *
	 * @param {string} term The search term.
	 * @since 3.0
	 * @updated 3.1
	 */
	doSearch(term) {
		let self = this;
		let type = 'term';
		this.page = 1; // reset page num

		let url = `${API.search_api}${API.app_id}${API.posts_per_page}&page=${this.page}&query=${this.search_term}`;

		if (this.hasOrientation()) {
			// Set orientation
			url = `${url}&orientation=${this.orientation}`;
		}

		// Search by ID
		// allow users to search by photo by prepending id:{photo_id} to search terms
		let search_type = term.substring(0, 3);
		if (search_type === 'id:') {
			type = 'id';
			term = term.replace('id:', '');
			url = `${API.photo_api}/${term}${API.app_id}`;
		}

		let input = this.container.querySelector('#photo-search');

		fetch(url)
			.then((data) => data.json())
			.then(function (data) {
				// Term Search
				if (type === 'term') {
					self.total_results = data.total;

					// Check for returned data
					self.checkTotalResults(data.results.length);

					// Update Props
					self.results = data.results;
					self.setState({ results: self.results });
				}

				// Search by photo ID
				if (type === 'id' && data) {
					// Convert return data to array
					let photoArray = [];

					if (data.errors) {
						// If error was returned

						self.total_results = 0;
						self.checkTotalResults('0');
					} else {
						// No errors, display results

						photoArray.push(data);

						self.total_results = 1;
						self.checkTotalResults('1');
					}

					self.results = photoArray;
					self.setState({ results: self.results });
				}

				input.classList.remove('searching');
			})
			.catch(function (error) {
				console.log(error);
				self.isLoading = false;
			});
	}

	/**
	 * Reset search results and results view.
	 *
	 * @since 3.0
	 */
	clearSearch() {
		let input = this.container.querySelector('#photo-search');
		input.value = '';
		this.total_results = 0;
		this.is_search = false;
		this.search_term = '';
		this.clearOrientation();
	}

	/**
	 * Load next set of photos, infinite scroll style.
	 *
	 * @since 3.0
	 */
	getPhotos() {
		let self = this;
		this.page = parseInt(this.page) + 1;
		this.container.classList.add('loading');
		this.isLoading = true;

		let url = `${API.photo_api}${API.app_id}${API.posts_per_page}&page=${this.page}&order_by=${this.orderby}`;

		if (this.is_search) {
			url = `${API.search_api}${API.app_id}${API.posts_per_page}&page=${this.page}&query=${this.search_term}`;
			if (this.hasOrientation()) {
				// Set orientation
				url = `${url}&orientation=${this.orientation}`;
			}
		}

		fetch(url)
			.then((data) => data.json())
			.then(function (data) {
				if (self.is_search) {
					data = data.results; // Search results are recieved in different JSON format
				}

				// Loop results, push items into array
				data.map((data) => {
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
	 * Toogles the photo view (New/Popular/Old).
	 *
	 * @param view   string    Current view
	 * @param e      element   Clicked element
	 * @since 3.0
	 */
	togglePhotoList(view, e) {
		let el = e.target;
		if (el.classList.contains('active')) return false; // exit if active

		el.classList.add('loading'); // Add class to nav btn
		this.isLoading = true;
		let self = this;
		this.page = 1;
		this.orderby = view;
		this.results = [];
		this.clearSearch();

		let url = `${API.photo_api}${API.app_id}${API.posts_per_page}&page=${this.page}&order_by=${this.orderby}`;
		fetch(url)
			.then((data) => data.json())
			.then(function (data) {
				// Check for returned data
				self.checkTotalResults(data.length);

				// Update Props
				self.results = data;
				self.setState({ results: data });

				el.classList.remove('loading'); // Remove class from nav btn
			})
			.catch(function (error) {
				console.log(error);
				self.isLoading = false;
			});
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
		let self = this;
		let photoListWrapper = self.container.querySelector('.photo-target');
		imagesLoaded(photoListWrapper, function () {
			self.msnry = new Masonry(photoListWrapper, {
				itemSelector: '.photo',
			});
			[...self.container.querySelectorAll('.photo-target .photo')].forEach((el) => el.classList.add('in-view'));
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
			this.getPhotos();
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
		let self = this;
		// Remove .active class
		[...this.container.querySelectorAll('.control-nav button')].forEach((el) => el.classList.remove('active'));

		// Set active item, if not search
		if (!this.is_search) {
			let active = this.container.querySelector(`.control-nav li button.${this.orderby}`);
			active.classList.add('active');
		}
		setTimeout(function () {
			self.isLoading = false;
			self.container.classList.remove('loading');
		}, 1000);
	}

	/**
	 * Show the tooltip.
	 *
	 * @since 4.3.0
	 */
	showTooltip(e) {
		let self = this;
		let target = e.currentTarget;
		let rect = target.getBoundingClientRect();
		let left = Math.round(rect.left);
		let top = Math.round(rect.top);
		let tooltip = this.container.querySelector('#tooltip');
		tooltip.classList.remove('over');

		if (target.classList.contains('tooltip--above')) {
			tooltip.classList.add('above');
		} else {
			tooltip.classList.remove('above');
		}

		// Get Content
		let title = target.dataset.title;

		// Delay reveal
		this.tooltipInterval = setInterval(function () {
			clearInterval(self.tooltipInterval);
			tooltip.innerHTML = title;

			// Position Tooltip
			left = left - tooltip.offsetWidth + target.offsetWidth + 5;
			tooltip.style.left = `${left}px`;
			tooltip.style.top = `${top}px`;

			setTimeout(function () {
				tooltip.classList.add('over');
			}, 150);
		}, 500);
	}

	/**
	 * Hide the tooltip.
	 *
	 * @since 4.3.0
	 */
	hideTooltip(e) {
		clearInterval(this.tooltipInterval);
		let tooltip = this.container.querySelector('#tooltip');
		tooltip.classList.remove('over');
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
		this.container.classList.remove('loading');
		this.wrapper.classList.add('loaded');

		if (this.is_block_editor || this.is_media_router) {
			// Gutenberg || Media Popup
			this.page = 0;
			this.getPhotos();
		} else {
			// Add scroll event
			window.addEventListener('scroll', () => this.onScroll());
		}
	}

	render() {
		// Show/Hide orientation listing
		let orientationStyle = this.is_search ? { display: 'flex' } : { display: 'none' };

		return (
			<div id="photo-listing" className={this.service}>
				<ul className="control-nav">
					<li>
						<button type="button" className="latest" onClick={(e) => this.togglePhotoList('latest', e)}>
							{instant_img_localize.latest}
						</button>
					</li>
					<li id="nav-target">
						<button type="button" className="popular" onClick={(e) => this.togglePhotoList('popular', e)}>
							{instant_img_localize.popular}
						</button>
					</li>
					<li>
						<button type="button" className="oldest" onClick={(e) => this.togglePhotoList('oldest', e)}>
							{instant_img_localize.oldest}
						</button>
					</li>
					<li className="search-field" id="search-bar">
						<form onSubmit={(e) => this.search(e)} autoComplete="off">
							<label htmlFor="photo-search" className="offscreen">
								{instant_img_localize.search_label}
							</label>
							<input type="search" id="photo-search" placeholder={instant_img_localize.search} />
							<button type="submit" id="photo-search-submit">
								<i className="fa fa-search"></i>
							</button>
							<ResultsToolTip
								container={this.container}
								isSearch={this.is_search}
								total={this.total_results}
								title={this.total_results + ' ' + instant_img_localize.search_results + ' ' + this.search_term}
							/>
						</form>
					</li>
				</ul>

				<div className="error-messaging"></div>

				<div className="orientation-list" style={orientationStyle}>
					<span>
						<i className="fa fa-filter" aria-hidden="true"></i> {instant_img_localize.orientation}:
					</span>
					<ul>
						<li tabIndex="0" onClick={(e) => this.setOrientation('landscape', e)} onKeyPress={(e) => this.setOrientation('landscape', e)}>
							{instant_img_localize.landscape}
						</li>
						<li tabIndex="0" onClick={(e) => this.setOrientation('portrait', e)} onKeyPress={(e) => this.setOrientation('portrait', e)}>
							{instant_img_localize.portrait}
						</li>
						<li tabIndex="0" onClick={(e) => this.setOrientation('squarish', e)} onKeyPress={(e) => this.setOrientation('squarish', e)}>
							{instant_img_localize.squarish}
						</li>
					</ul>
				</div>

				<div id="photos" className="photo-target">
					{this.state.results.map((result, iterator) => (
						<Photo
							result={result}
							key={result.id + iterator}
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

				<div className={this.total_results == 0 && this.is_search === true ? 'no-results show' : 'no-results'} title={this.props.title}>
					<h3>{instant_img_localize.no_results} </h3>
					<p>{instant_img_localize.no_results_desc} </p>
				</div>

				<div className="loading-block" />

				<div className="load-more-wrap">
					<button type="button" className="button" onClick={() => this.getPhotos()}>
						{instant_img_localize.load_more}
					</button>
				</div>

				<div id="tooltip">Meow</div>
			</div>
		);
	}
}

export default PhotoList;
