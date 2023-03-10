/**
 * Render the ResultsToolTip component.
 *
 * @param {Object} props The component props.
 * @return {JSX.Element} The ResultsToolTip component.
 */
export default function ResultsToolTip(props) {
	const { is_search, title, total, getPhotos } = props;
	return (
		<div className={is_search ? 'searchResults' : 'searchResults hide'}>
			<span title={title}>{total}</span>
			<button type="button" title={instant_img_localize.clear_search} onClick={() => getPhotos()}>
				x<span className="offscreen">{instant_img_localize.clear_search}</span>
			</button>
		</div>
	);
}
