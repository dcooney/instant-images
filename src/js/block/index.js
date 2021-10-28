import Block from "./components/block";
import Menu from "./components/menu";
const { Fragment } = wp.element;
const { registerPlugin } = wp.plugins;

const InstantImages = () => (
	<Fragment>
		<Menu />
		<Block />
	</Fragment>
);

// Register the sidebar plugin
registerPlugin("instant-images", {
	render: InstantImages,
});
