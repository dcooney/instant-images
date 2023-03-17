import Icon from "./Icon";
import Panel from "./Panel";
const { PluginSidebar } = wp.editPost;

/**
 * The plugin sidebar as a component.
 *
 * @return {JSX.Element} The Plugin component.
 */
export default function Plugin() {
	return (
		<PluginSidebar
			icon={<Icon borderless color="unsplash" />}
			name="instant-images-sidebar"
			title="Instant Images"
		>
			<Panel />
		</PluginSidebar>
	);
}
