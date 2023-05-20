import { forwardRef } from "@wordpress/element";
import classNames from "classnames";
import SearchToolTip from "./SearchToolTip";

/**
 * Render the SearchForm component.
 *
 * @return {JSX.Element} The SearchForm component.
 */
const SearchForm = forwardRef((props, ref) => {
	const { searchHandler, apiError, search } = props;

	return (
		<div
			className={classNames(
				"control-nav--search",
				"search-field",
				apiError ? "inactive" : null
			)}
		>
			<form onSubmit={(e) => searchHandler(e)} autoComplete="off">
				<label htmlFor="search-input" className="offscreen">
					{instant_img_localize.search_label}
				</label>
				<input
					type="search"
					id="search-input"
					placeholder={instant_img_localize.search}
					ref={ref}
					disabled={apiError}
				/>
				<button type="submit" disabled={apiError}>
					<i className="fa fa-search"></i>
					<span className="offscreen">{instant_img_localize.search}</span>
				</button>
				<SearchToolTip search={search} />
			</form>
		</div>
	);
});
export default SearchForm;
