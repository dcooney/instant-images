import Icon from "./Icon";
const { PluginSidebarMoreMenuItem } = wp.editPost;

/**
 * The plugin menu as a component.
 *
 * @returns {JSX.Element} The Menu component.
 */
export default function Menu() {
	return (
		<PluginSidebarMoreMenuItem
			icon={<Icon color="unsplash" />}
			target="instant-images-sidebar"
			className="instant-images-menu-item"
		>
			Instant Images
		</PluginSidebarMoreMenuItem>
	);
}
