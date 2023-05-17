import { forwardRef } from "@wordpress/element";

/**
 * Render the LoadMore component.
 *
 * @return {JSX.Element} The LoadMore component.
 */
const LoadMore = forwardRef((props, ref) => {
	const { loadMorePhotos } = props;
	return (
		<div className="load-more-wrap" ref={ref}>
			<button type="button" className="button" onClick={() => loadMorePhotos()}>
				{instant_img_localize.load_more}
			</button>
		</div>
	);
});
export default LoadMore;
