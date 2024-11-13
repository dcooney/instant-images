import { Fragment } from '@wordpress/element';
import { registerPlugin } from '@wordpress/plugins';
import Plugin from './editor/plugin';
import Menu from './editor/plugin/components/Menu';

/**
 * Instant Images as a Gutenberg Plugin Sidebar.
 *
 * @return {JSX.Element} The InstantImagesPlugin component.
 */
const InstantImagesPlugin = () => (
	<Fragment>
		<Menu />
		<Plugin />
		dw
	</Fragment>
);

// Register the sidebar plugin.
registerPlugin('instant-images', {
	render: InstantImagesPlugin,
});
