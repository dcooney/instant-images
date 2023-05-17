import { PluginSidebarMoreMenuItem } from "@wordpress/edit-post";
import Icon from "../../../components/Icon";

/**
 * The plugin menu as a component.
 *
 * @return {JSX.Element} The Menu component.
 */
export default function Menu() {
	return (
		<PluginSidebarMoreMenuItem
			icon={<Icon borderless />}
			target="instant-images-sidebar"
			className="instant-images-menu-item"
		>
			Instant Images
		</PluginSidebarMoreMenuItem>
	);
}
