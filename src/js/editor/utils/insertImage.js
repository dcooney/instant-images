import { createBlock } from "@wordpress/blocks";
import { dispatch } from "@wordpress/data";

/**
 * Insert an image block into the block editor.
 *
 * @param {Object} attachment The attachment object.
 * @param {string} clientId   The block ID.
 */
export default function insertImage(attachment, clientId) {
	const { id = null, url = null, caption = "", alt = "" } = attachment;

	if (!url || !id) {
		return;
	}

	// Create block.
	const block = createBlock("core/image", {
		id,
		url,
		caption,
		alt,
	});

	if (clientId) {
		// Replace the Instant Images block.
		dispatch("core/block-editor").replaceBlock(clientId, block);
	} else {
		// Insert Image block.
		dispatch("core/block-editor").insertBlocks(block);
	}
}
