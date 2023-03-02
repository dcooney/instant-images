const { dispatch } = wp.data;

/**
 * Set image as featured,
 *
 * @param {string} imageId The attachment ID
 * @returns
 */
const SetFeaturedImage = (imageId) => {
	if (imageId === null) {
		return false;
	}
	dispatch("core/editor").editPost({ featured_media: imageId });
};
export default SetFeaturedImage;
