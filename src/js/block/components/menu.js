import Icon from "./utils/icon";
const { PluginSidebarMoreMenuItem } = wp.editPost;

const Menu = () => (
	<PluginSidebarMoreMenuItem
		icon={<Icon color="unsplash" />}
		target="instant-images-sidebar"
		className="instant-images-menu-item"
	>
		Instant Images
	</PluginSidebarMoreMenuItem>
);
export default Menu;
