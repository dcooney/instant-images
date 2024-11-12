import { forwardRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';

/**
 * Render the LoadMore component.
 *
 * @return {JSX.Element} The LoadMore component.
 */
const LoadMore = forwardRef((props, ref) => {
	const { loadMorePhotos, loading, done } = props;

	return (
		<div className={classNames('load-more-wrap', loading ? 'loading' : null, done ? 'done' : null)} ref={ref}>
			<button type="button" className="button" onClick={() => loadMorePhotos()}>
				{__('Load More Images', 'instant-images')}
			</button>
		</div>
	);
});
export default LoadMore;
