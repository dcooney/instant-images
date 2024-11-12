import { forwardRef, useEffect, useRef, useState } from '@wordpress/element';
import classNames from 'classnames';
import { usePluginContext } from '../../common/pluginProvider';
import { getSearchHistory, saveSearchHistory } from '../../functions/localStorage';
import { useClickOutside } from '../../hooks/useClickOutside';
import { ExtendedSearchCTA } from '../cta/Extended';
import SearchHistory from './SearchHistory';
import SearchToolTip from './SearchToolTip';

/**
 * Render the search form as a component.
 *
 * @return {JSX.Element} The SearchForm component.
 */
const SearchForm = forwardRef(({}, ref) => {
	const { activated: extended_activated = false, license: extended_license = false } = instant_img_localize?.addons?.extended;
	const { searchHandler, apiError, suggestions, getSuggestions } = usePluginContext();
	const [history, setHistory] = useState([]);
	const [show, setShow] = useState(false);

	const historyRef = useRef(null);
	const submitBtnRef = useRef(null);

	// Handle clickoutside hook.
	useClickOutside(historyRef, () => {
		setShow(false);
	});

	/**
	 * Set the search value in the form.
	 *
	 * @param {string} value The value to set.
	 */
	function setSearchValue(value) {
		const input = ref?.current;
		input.value = value;
		submitBtnRef?.current.click();

		// Set focus on input.
		input.focus();
	}

	/**
	 * Search submit handler.
	 *
	 * @param {Event} e The event object.
	 */
	function formSubmit(e) {
		e.preventDefault();
		const term = ref?.current?.value;
		if (term) {
			searchHandler(e);
			if (extended_license) {
				saveSearchHistory(term);
				setHistory(getSearchHistory());
			}
		}
	}

	/**
	 * Should the history div be shown?
	 *
	 * @return {boolean} Show history.
	 */
	function showHistory() {
		return history?.length || suggestions?.length;
	}

	useEffect(() => {
		setHistory(getSearchHistory());
	}, []);

	return (
		<div className={classNames('control-nav--search', apiError ? 'inactive' : null)}>
			<form onSubmit={(e) => formSubmit(e)} autoComplete="off">
				<label htmlFor="search-input" className="offscreen">
					{instant_img_localize.search_label}
				</label>
				<div ref={historyRef}>
					<input
						ref={ref}
						type="text"
						id="search-input"
						placeholder={instant_img_localize.search}
						disabled={apiError}
						onChange={(e) => extended_license && getSuggestions(e.target.value)}
						onFocus={() => setShow(true)}
					/>
					{extended_license && showHistory() ? (
						/* Extended: Show only with valid add-on license */
						<SearchHistory show={show} history={history} setHistory={setHistory} setSearchValue={setSearchValue} container={historyRef} />
					) : null}
					{!extended_activated && (
						/* Extended: Show only when add-on not installed. */
						<ExtendedSearchCTA show={show} />
					)}
				</div>
				<button type="submit" disabled={apiError} ref={submitBtnRef}>
					<i className="fa fa-search"></i>
					<span className="offscreen">{instant_img_localize.search}</span>
				</button>
				<SearchToolTip show={show} />
			</form>
		</div>
	);
});
export default SearchForm;
