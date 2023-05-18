import { Fragment, forwardRef } from "@wordpress/element";
import LoadingBlock from "./LoadingBlock";

/**
 * Render the LoadMore component.
 *
 * @return {JSX.Element} The LoadMore component.
 */
const LoadMore = forwardRef((props, ref) => {
	const { className, loadMorePhotos, loading, total } = props;

	return (
		<Fragment>
			<div className={className} ref={ref}>
				<button
					type="button"
					className="button"
					onClick={() => loadMorePhotos()}
				>
					{instant_img_localize.load_more}
				</button>
			</div>
			<LoadingBlock loading={loading} total={total} />
		</Fragment>
	);
});
export default LoadMore;
