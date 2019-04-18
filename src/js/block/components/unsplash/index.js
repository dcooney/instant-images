import classnames from "classnames";
import Icon from "../icon";
import SetFeaturedImage from "../setFeaturedImage";
import InsertImage from "../insertImage";
import PhotoList from "../../../components/PhotoList";

const { Component } = wp.element;
const { PluginSidebar, PluginSidebarMoreMenuItem } = wp.editPost;


const Unsplash = () => (
	<PluginSidebar
		icon={<Icon borderless color="unsplash" />}
		name="instant-images-sidebar"
		title="Instant Images"
	>
		<div className="instant-img-container">
			<PhotoList editor='gutenberg' page='1' orderby='latest' service='unsplash' SetFeaturedImage={SetFeaturedImage} InsertImage={InsertImage} />
		</div>
	</PluginSidebar>
);
export default Unsplash;