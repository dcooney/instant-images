import classnames from "classnames";
import Icon from "../icon";
const { PluginSidebarMoreMenuItem } = wp.editPost;

const UnsplashMenu = () => (
	<PluginSidebarMoreMenuItem
		icon={<Icon color="unsplash" />}
		target="instant-images-sidebar"
		className="instant-images-menu-item"
	>
		Instant Images
	</PluginSidebarMoreMenuItem>
);
export default UnsplashMenu;
