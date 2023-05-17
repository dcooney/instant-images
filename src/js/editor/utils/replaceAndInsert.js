import { createBlock } from "@wordpress/blocks";
import { dispatch } from "@wordpress/data";

/**
 * Replace the InstantImages block with an Image block.
 *
 * @param {string} url      Image URL.
 * @param {string} caption  Image caption.
 * @param {string} alt      Image alt.
 * @param {string} clientId The block ID.
 */
export default function replaceAndInsert(url, caption, alt, clientId) {
	const block = createBlock("core/image", {
		url,
		caption,
		alt,
	});
	dispatch("core/block-editor").replaceBlock(clientId, block);
}
