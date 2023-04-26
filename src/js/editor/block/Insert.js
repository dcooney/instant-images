import { store as blockEditorStore } from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";

const Insert = (CurrentMenuItems, props) => {
	// eslint-disable-next-line
	const { attributes, setAttributes, clientId } = props;
	const showMenu = useSelect(
		(select) => {
			const currentBlock = select(blockEditorStore).getBlock(clientId);
			return currentBlock.name === "core/image";
		},
		[clientId]
	);

	if (!showMenu) {
		return <CurrentMenuItems {...props} />;
	}
	return <div>MEOWWWW</div>;
};

export default Insert;
