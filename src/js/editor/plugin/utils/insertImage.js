const { createBlock } = wp.blocks;

/**
 * Insert an image block into the block editor.
 *
 * @param {string} url     Image URL.
 * @param {string} caption Image caption.
 * @param {string} alt     Image alt.
 */
const insertImage = (url = '', caption = '', alt = '') => {
	if (url === '') {
		return false;
	}
	const block = createBlock('core/image', {
		url: url,
		caption: caption,
		alt: alt,
	});
	wp.data.dispatch('core/editor').insertBlocks(block);
};
export default insertImage;
