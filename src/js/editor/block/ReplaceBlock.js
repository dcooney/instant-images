import {
	store as blockEditorStore
} from "@wordpress/block-editor";
import { createBlock } from "@wordpress/blocks";
import { useDispatch, useSelect } from "@wordpress/data";
import { useEffect } from "@wordpress/element";

/**
 * Replace the Instant Images block with an Image block.
 *
 * @param {object} props Block props.
 * @returns
 */
const ReplaceBlock = ({ clientId, attributes: imageFilters }) => {
	const block = useSelect(
		(select) => select(blockEditorStore).getBlock(clientId ?? ""),
		[clientId]
	);

	const { replaceBlock } = useDispatch(blockEditorStore);

	useEffect(() => {
		if (!block?.name || !replaceBlock || !clientId) return;
		if (block.innerBlocks[0]) {
			const attributes = Object.assign({}, block.innerBlocks[0].attributes, {
				// There's a chancge our attributes were filtered by another plugin
				// so better to be explicit here
				imageFilters: {
					sourceImageId: imageFilters?.sourceImageId,
					filteredFromImageId: imageFilters?.filteredFromImageId,
					currentImageId: imageFilters?.currentImageId,
					currentFilterSlug: imageFilters?.currentFilterSlug,
				},
			});
			replaceBlock(clientId, [createBlock("core/image", attributes)]);
			return;
		}
		const blockData = createBlock("core/image");
		replaceBlock(clientId, [blockData]).then(() => {
			const { clientId } = blockData;
			// Open the Instant Images when user inserts the block.
			window.dispatchEvent(
				new CustomEvent("kevinbatdorf/open-image-filters", {
					bubbles: true,
					detail: { clientId },
				})
			);
		});
	}, [block, replaceBlock, clientId, imageFilters]);

	return null;
};

export default ReplaceBlock;
