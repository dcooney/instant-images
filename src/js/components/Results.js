import { Fragment } from '@wordpress/element';
import Photo from './Photo';
import Sponsor from './Sponsor';

/**
 * Render the Results component.
 *
 * @param {Object} props The component props.
 * @return {JSX.Element} The Results component.
 */
export default function Results(props) {
	const { results, provider, is_media_router, is_block_editor, setFeaturedImage, insertImage } = props;
	return (
		<Fragment>
			{!!results?.length &&
				results.map((result, index) => (
					<Fragment key={`${provider}-${result.id}-${index}`}>
						{result?.type === 'instant-images-ad' ? (
							<Sponsor result={result} />
						) : (
							<Photo
								provider={provider}
								result={result}
								mediaRouter={is_media_router}
								blockEditor={is_block_editor}
								setFeaturedImage={setFeaturedImage}
								insertImage={insertImage}
							/>
						)}
					</Fragment>
				))}
		</Fragment>
	);
}
