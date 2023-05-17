import { createBlock } from "@wordpress/blocks";
import { dispatch } from "@wordpress/data";

/**
 * Insert an image block into the block editor.
 *
 * @param {string} url     Image URL.
 * @param {string} caption Image caption.
 * @param {string} alt     Image alt.
 */
export default function insertImage(url = "", caption = "", alt = "") {
	if (url === "") {
		return false;
	}
	const block = createBlock("core/image", {
		url,
		caption,
		alt,
	});
	dispatch("core/block-editor").insertBlocks(block);
}
