/**
 * Render the LoadMore component.
 *
 * @param {Object} props The component props.
 * @return {JSX.Element} The LoadMore component.
 */
export default function LoadMore(props) {
	const { loadMorePhotos } = props;
	return (
		<div className="load-more-wrap">
			<button type="button" className="button" onClick={() => loadMorePhotos()}>
				{instant_img_localize.load_more}
			</button>
		</div>
	);
}
