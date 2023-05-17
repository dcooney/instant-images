import {
	BlockControls,
	InnerBlocks,
	useBlockProps,
} from "@wordpress/block-editor";
import { registerBlockType } from "@wordpress/blocks";
import { DropdownMenu } from "@wordpress/components";
import { useEffect, useRef, useState } from "@wordpress/element";
import Icon from "../../components/Icon";
import InstantImages from "../../components/InstantImages";
import getProvider from "../../functions/getProvider";
import blockConfig from "./block.json";
import { API } from "../../constants/API";
const providers = API.providers;

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
	const [mounted, setMounted] = useState(false);
	const containerRef = useRef();
	const blockProps = useBlockProps();

	/**
	 * Get a list of the Providers.
	 *
	 * @return {Array} The list of Providers.
	 */
	function getProviders() {
		const theProviders = providers.map((item) => {
			return {
				title: item,
				icon: API[item.toLowerCase()].icon,
			};
		});
		return theProviders;
	}

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
				<BlockControls>
					<DropdownMenu label="Select a Provider" controls={getProviders()} />
				</BlockControls>
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
