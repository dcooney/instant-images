import { forwardRef, useEffect, useRef, useState } from "@wordpress/element";
import classNames from "classnames";
import { usePluginContext } from "../../common/pluginProvider";
import {
	getSearchHistory,
	saveSearchHistory,
} from "../../functions/localStorage";
import { useClickOutside } from "../../hooks/useClickOutside";
import SearchHistory, { ExtendedCTA } from "./SearchHistory";
import SearchToolTip from "./SearchToolTip";

/**
 * Render the search form as a component.
 *
 * @return {JSX.Element} The SearchForm component.
 */
const SearchForm = forwardRef(({}, ref) => {
	const { extended = false } = instant_img_localize?.addons;
	const { searchHandler, apiError, suggestions, getSuggestions } =
		usePluginContext();
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
			if (extended) {
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
		<div
			className={classNames(
				"control-nav--search",
				apiError ? "inactive" : null
			)}
		>
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
						onChange={(e) => extended && getSuggestions(e.target.value)}
						onFocus={() => setShow(true)}
					/>
					{!!extended && showHistory() ? (
						<SearchHistory
							show={show}
							history={history}
							setHistory={setHistory}
							setSearchValue={setSearchValue}
						/>
					) : null}
					{!extended && <ExtendedCTA show={show} />}
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
