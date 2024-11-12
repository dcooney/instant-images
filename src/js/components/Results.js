import { Fragment, forwardRef, useState } from '@wordpress/element';
import Photo from './Photo';
import Sponsor from './Sponsor';

/**
 * Render the Results component.
 *
 * @return {JSX.Element} The Results component.
 */
const Results = forwardRef((props, ref) => {
	const { data } = props;
	const [inactive, setInactive] = useState(false);

	return (
		<div id="photos" className={inactive ? 'inactive' : null} ref={ref}>
			{!!data?.length &&
				data.map((result, index) => (
					<Fragment key={`${result.id}-${index}`}>
						{result?.type === 'instant-images-ad' ? <Sponsor result={result} /> : <Photo result={result} type={result?.type} setInactive={setInactive} />}
					</Fragment>
				))}
		</div>
	);
});
export default Results;
