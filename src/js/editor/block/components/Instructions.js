import { __ } from "@wordpress/i18n";

/**
 * Render instructional text for the WP Block.
 *
 * @param {Object} props The component props.
 * @return {JSX.Element} The BlockInstructions component.
 */
export default function BlockInstructions(props) {
	const { show = false } = props;
	if (!show) {
		return null;
	}

	return (
		<div className="instant-images-block--instructions">
			<span>&larr;</span>
			{__("Scroll to Load Images", "instant-images")}
			<span>&rarr;</span>
		</div>
	);
}
