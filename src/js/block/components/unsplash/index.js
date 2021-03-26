import Icon from "../icon";
import SetFeaturedImage from "../setFeaturedImage";
import InsertImage from "../insertImage";
import PhotoList from "../../../components/PhotoList";
const { PluginSidebar } = wp.editPost;

const Unsplash = () => (
	<PluginSidebar
		icon={<Icon borderless color="unsplash" />}
		name="instant-images-sidebar"
		title="Instant Images"
	>
		<div className="instant-img-container">
			<PhotoList
				editor="gutenberg"
				page="1"
				orderby="latest"
				service="unsplash"
				SetFeaturedImage={SetFeaturedImage}
				InsertImage={InsertImage}
			/>
		</div>
	</PluginSidebar>
);
export default Unsplash;
