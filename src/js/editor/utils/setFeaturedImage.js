import { dispatch } from "@wordpress/data";

/**
 * Set image as featured image in Gutenberg.
 *
 * @param {string} imageId The attachment ID.
 */
export default function setFeaturedImage(imageId) {
	if (imageId === null) {
		return false;
	}
	// Set the featured image.
	dispatch("core/editor").editPost({ featured_media: imageId });

	// Open the document sidebar.
	dispatch("core/edit-post").openGeneralSidebar("edit-post/document");
}
