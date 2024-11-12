import { Fragment, forwardRef, useEffect, useState } from '@wordpress/element';
import { useInView } from 'react-intersection-observer';
import { usePluginContext } from '../common/pluginProvider';
import WPBlockInstructions from '../editor/block/components/Instructions';
import WPBlockLoadMore from '../editor/block/components/LoadMore';
import Photo from './Photo';
import Sponsor from './Sponsor';

/**
 * Render the Results component.
 *
 * @return {JSX.Element} The Results component.
 */
const ResultsWPBlock = forwardRef((props, ref) => {
	const { data, done = false, loadMorePhotos } = props;
	const { wpBlock = false } = usePluginContext();
	const [inactive, setInactive] = useState(false);

	const [loadMoreRef, inView] = useInView({
		rootMargin: '0px 0px',
	});

	// Scroll in-view callback.
	useEffect(() => {
		if (wpBlock) {
			loadMorePhotos();
		}
	}, [inView]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<Fragment>
			<div id="photos" className={inactive ? 'inactive' : null} ref={ref}>
				{!!data?.length &&
					data.map((result, index) => (
						<Fragment key={`${result.id}-${index}`}>
							{result?.type === 'instant-images-ad' ? <Sponsor result={result} /> : <Photo result={result} type={result?.type} setInactive={setInactive} />}
						</Fragment>
					))}
				<WPBlockLoadMore done={done} ref={loadMoreRef} />
			</div>
			<WPBlockInstructions show={data?.length} />
		</Fragment>
	);
});
export default ResultsWPBlock;
