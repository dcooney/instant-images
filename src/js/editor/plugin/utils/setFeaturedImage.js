import { dispatch } from "@wordpress/data";

/**
 * Set image as featured image in Gutenberg.
 *
 * @param {string} imageId The attachment ID.
 */
const setFeaturedImage = (imageId) => {
	if (imageId === null) {
		return false;
	}
	dispatch("core/editor").editPost({ featured_media: imageId });
};
export default setFeaturedImage;
