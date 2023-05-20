import { usePluginContext } from "../../common/pluginProvider";

/**
 * Render the SearchToolTip component.
 *
 * @param {Object} props The component props.
 * @return {JSX.Element} The SearchToolTip component.
 */
export default function ResultsToolTip(props) {
	const { search } = props;
	const { getPhotos } = usePluginContext();

	return (
		<div className={search?.active ? "searchResults" : "searchResults hide"}>
			<span
				title={`${search?.results} ${instant_img_localize.search_results} ${search?.term}`}
			>
				{search?.results}
			</span>
			<button
				type="button"
				title={instant_img_localize.clear_search}
				onClick={() => getPhotos()}
			>
				x<span className="offscreen">{instant_img_localize.clear_search}</span>
			</button>
		</div>
	);
}
