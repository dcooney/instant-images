import { FILTERS } from "../constants/filters";
import Filter from "./Filter";

/**
 * Render the SearchHeader component.
 *
 * @param {Object} props The component props.
 * @return {JSX.Element} The SearchHeader component.
 */
export default function SearchHeader(props) {
	const { provider, term = "", total = 0, filterSearch, getPhotos } = props;
	const filters = FILTERS[provider].search;

	return (
		<header className="search-header">
			<h2>{term.replace("id:", "ID: ")}</h2>
			<div className="search-header--text">
				{`${total} ${instant_img_localize.search_results}`}{" "}
				<strong>{`${term}`}</strong>
				<span>-</span>
				<button onClick={() => getPhotos()}>
					{instant_img_localize.clear_search}
				</button>
			</div>
			{filters && Object.entries(filters).length && (
				<div className="control-nav--filters-wrap">
					<div className="control-nav--filters">
						{Object.entries(filters).map(([key, filter], index) => (
							<Filter
								key={`${provider}-search-${key}-${index}`}
								filterKey={key}
								provider={provider}
								data={filter}
								function={filterSearch}
							/>
						))}
					</div>
				</div>
			)}
		</header>
	);
}
