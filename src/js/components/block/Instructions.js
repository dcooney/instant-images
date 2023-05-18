import { __ } from "@wordpress/i18n";

/**
 * Render instructions for the WP Block.
 *
 * @return {JSX.Element} The BlockInstructions component.
 */
export default function BlockInstructions() {
	return (
		<div className="instant-images-block--instructions">
			<span>&larr;</span>
			{__("Scroll to Load Images", "instant-images")}
			<span>&rarr;</span>
		</div>
	);
}
