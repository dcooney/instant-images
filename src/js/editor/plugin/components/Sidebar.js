import { useEffect, useRef, useState } from "@wordpress/element";
import InstantImages from "../../../components/InstantImages";
import getProvider from "../../../functions/getProvider";

/**
 * The image listing sidebar for the plugin sidebar.
 *
 * @return {JSX.Element} The Panel component.
 */
export default function Sidebar() {
	const provider = getProvider();
	const [mounted, setMounted] = useState(false);
	const containerRef = useRef();

	useEffect(() => {
		if (!mounted) {
			setMounted(true);
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div
			className="instant-img-container"
			data-editor="gutenberg-sidebar"
			ref={containerRef}
		>
			{!!mounted && (
				<InstantImages
					editor="sidebar"
					data={[]}
					api_error={null}
					provider={provider}
					container={containerRef?.current}
				/>
			)}
		</div>
	);
}
