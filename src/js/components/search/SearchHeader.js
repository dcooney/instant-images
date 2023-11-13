import { FILTERS } from "../../constants/filters";
import Filter from "../Filter";
import { usePluginContext } from "../../common/pluginProvider";

/**
 * Render the SearchHeader component.
 *
 * @return {JSX.Element} The SearchHeader component.
 */
export default function SearchHeader() {
	const { provider, search, getPhotos, filterSearch } = usePluginContext();
	const { active = false, term = "", results: total = 0 } = search;

	const filters = FILTERS[provider].search;

	if (!active) {
		// Exit if search is not active.
		return null;
	}

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
								handler={filterSearch}
							/>
						))}
					</div>
				</div>
			)}
		</header>
	);
}
