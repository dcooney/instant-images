import PhotoList from "../../../components/PhotoList";
import Icon from "../icon";
import InsertImage from "../insertImage";
import SetFeaturedImage from "../setFeaturedImage";
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
				provider="unsplash"
				SetFeaturedImage={SetFeaturedImage}
				InsertImage={InsertImage}
			/>
		</div>
	</PluginSidebar>
);
export default Unsplash;
