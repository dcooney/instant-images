import Plugin from "./editor/plugin";
import Menu from "./editor/plugin/components/Menu";
const { Fragment } = wp.element;
const { registerPlugin } = wp.plugins;

/**
 * Instant Images as a Gutenberg Plugin Sidebar.
 *
 * @return {JSX.Element} The InstantImagesPlugin component.
 */
const InstantImagesPlugin = () => (
	<Fragment>
		<Menu />
		<Plugin />
	</Fragment>
);

// Register the sidebar plugin.
registerPlugin("instant-images", {
	render: InstantImagesPlugin,
});
