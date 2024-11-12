import { PluginSidebar } from '@wordpress/edit-post';
import Icon from '../../../components/Icon';
import Sidebar from './Sidebar';

/**
 * The plugin sidebar as a component.
 *
 * @return {JSX.Element} The Plugin component.
 */
export default function Plugin() {
	return (
		<PluginSidebar icon={<Icon borderless />} name="instant-images-sidebar" title="Instant Images">
			<Sidebar />
		</PluginSidebar>
	);
}
