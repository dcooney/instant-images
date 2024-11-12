import { __ } from '@wordpress/i18n';

/**
 * Render help instructions for the WP Block.
 *
 * @return {JSX.Element} The BlockHelp component.
 */
export default function BlockHelp() {
	return (
		<div style={{ width: '300px', padding: '0 10px' }}>
			<p>
				<strong>{__('Instant Images Help', 'instant-images')}</strong>
			</p>
			<ol>
				<li>{__('Browse photos from the various stock image providers.', 'instant-images')}</li>
				<li>{__('Select/click an image to immediately start the upload process.', 'instant-images')}</li>
				<li>{__('Uploaded image will be inserted directly into the post using the WordPress core Image block.', 'instant-images')}</li>
			</ol>
		</div>
	);
}
