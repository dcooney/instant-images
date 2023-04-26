import { InnerBlocks } from "@wordpress/block-editor";
import { registerBlockType } from "@wordpress/blocks";
import { addFilter } from "@wordpress/hooks";
import { __ } from "@wordpress/i18n";
import Insert from "../js/editor/block/Insert";
import ReplaceBlock from "../js/editor/block/ReplaceBlock";
import { IconSVG } from "../js/editor/components/Icon";
import config from "./block.json";

/**
 * Register the block.
 */
registerBlockType("instant-images/images", {
	...config,
	title: __("Instant Images", "instant-images"),
	icon: IconSVG,
	edit: ({ clientId, attributes }) => (
		<ReplaceBlock clientId={clientId} attributes={attributes} />
	),
	save: () => <InnerBlocks.Content />,
});

/**
 * Add to the core image block
 */
addFilter(
	"editor.BlockEdit",
	config.name,
	(CurrentMenuItems) =>
		// Not sure how to type these incoming props
		// eslint-disable-next-line
		(props) =>
			// It seems like Gutenberg wants a top level component here
			Insert(CurrentMenuItems, props)
);

// Add our attributes
addFilter("blocks.registerBlockType", config.name, (settings) => {
	if (settings.name !== "core/image") return settings;
	return {
		...settings,
		attributes: {
			...settings.attributes,
			imageFilters: {
				sourceImageId: { type: "number" },
				currentImageId: { type: "number" },
				currentFilterSlug: { type: "string" },
				filteredFromImageId: { type: "number" },
			},
		},
	};
});
