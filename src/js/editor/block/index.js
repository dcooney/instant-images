import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";
import { registerBlockType } from "@wordpress/blocks";
import { useRef, useState, useEffect } from "@wordpress/element";
import Icon from "../../components/Icon";
import InstantImages from "../../components/InstantImages";
import getProvider from "../../functions/getProvider";
import blockConfig from "./block.json";

// Register the block
registerBlockType("connekthq/instant-images", {
	...blockConfig,
	icon: Icon,
	edit({ clientId }) {
		return <InstantImagesBlock clientId={clientId} />;
	},
	save() {
		return <InnerBlocks.Content />;
	},
});

/**
 * Render the InstantImages component.
 *
 * @param {Object} props          The component props.
 * @param {string} props.clientId WP block client ID.
 * @return {JSX.Element}          The InstantImagesBlock component.
 */
function InstantImagesBlock({ clientId }) {
	const provider = getProvider();
	const [mounted, setMounted] = useState(false); // App mounted state.
	const containerRef = useRef();
	const blockProps = useBlockProps();

	useEffect(() => {
		if (!mounted) {
			setMounted(true);
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div {...blockProps}>
			<div
				className="instant-img-container"
				data-editor="block"
				ref={containerRef}
			>
				{!!mounted && (
					<InstantImages
						editor="block"
						provider={provider}
						clientId={clientId}
						data={[]}
						container={containerRef?.current}
					/>
				)}
			</div>
		</div>
	);
}
