import { BlockControls, InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { registerBlockType } from '@wordpress/blocks';
import { ToolbarDropdownMenu, ToolbarGroup } from '@wordpress/components';
import { useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { help } from '@wordpress/icons';
import { IconLogo } from '../../components/Icon';
import InstantImages from '../../components/InstantImages';
import getProvider from '../../functions/getProvider';
import blockConfig from './block.json';
import WPBlockHelp from './components/Help';

// Register the block
registerBlockType('connekthq/instant-images', {
	...blockConfig,
	icon: IconLogo,
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
	const blockProps = useBlockProps({
		className: `instant-images-block`,
	});

	useEffect(() => {
		if (!mounted) {
			setMounted(true);
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div {...blockProps}>
			<div className="instant-img-container" data-editor="block" ref={containerRef}>
				<BlockControls>
					<ToolbarGroup>
						<ToolbarDropdownMenu label={__('Help', 'instant-images')} icon={help}>
							{() => {
								return <WPBlockHelp />;
							}}
						</ToolbarDropdownMenu>
					</ToolbarGroup>
				</BlockControls>
				{!!mounted && <InstantImages editor="block" provider={provider} clientId={clientId} data={[]} container={containerRef?.current} />}
			</div>
		</div>
	);
}
