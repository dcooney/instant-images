import classNames from "classnames";
import { usePluginContext } from "../../common/pluginProvider";

/**
 * Render the search results tooltip component.
 *
 * @return {JSX.Element} The SearchToolTip component.
 */
export default function SearchToolTip() {
	const { getPhotos, search } = usePluginContext();

	return (
		<div
			className={classNames(
				"control-nav--search-tooltip",
				search?.active ? null : "hide"
			)}
		>
			<span
				title={`${search?.results} ${instant_img_localize.search_results} ${search?.term}`}
			>
				{search?.results}
			</span>
			<button
				type="button"
				title={instant_img_localize.clear_search}
				onClick={() => getPhotos(true)}
			>
				x<span className="offscreen">{instant_img_localize.clear_search}</span>
			</button>
		</div>
	);
}
