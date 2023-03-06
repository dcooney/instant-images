/**
 * Render the ResultsToolTip component.
 *
 * @param {Object} props The component props.
 * @return {JSX.Element} The ResultsToolTip component.
 */
export default function ResultsToolTip(props) {
	const { isSearch, title, total, getPhotos } = props;
	return (
		<div className={isSearch ? 'searchResults' : 'searchResults hide'}>
			<span title={title}>{total}</span>
			<button type="button" title={instant_img_localize.clear_search} onClick={() => getPhotos('latest')}>
				x<span className="offscreen">{instant_img_localize.clear_search}</span>
			</button>
		</div>
	);
}
