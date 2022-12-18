import React from "react";
import BlockLoader from "./blockLoader";
import Icon from "./utils/icon";
const { PluginSidebar } = wp.editPost;

const Block = () => {
	return (
		<PluginSidebar
			icon={<Icon borderless color="unsplash" />}
			name="instant-images-sidebar"
			title="Instant Images"
		>
			<BlockLoader />
		</PluginSidebar>
	);
};
export default Block;
