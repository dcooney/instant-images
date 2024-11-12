import { dispatch } from '@wordpress/data';

/**
 * Set image as featured image in Gutenberg.
 *
 * @param {Object} attachment The attachment object.
 */
export default function setFeaturedImage(attachment) {
	const { id = null } = attachment;
	if (!id) {
		return;
	}

	// Set the featured image.
	dispatch('core/editor').editPost({ featured_media: id });

	// Open the document sidebar.
	dispatch('core/edit-post').openGeneralSidebar('edit-post/document');
}
