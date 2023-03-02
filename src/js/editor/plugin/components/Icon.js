import classnames from "classnames";

/**
 * The plugin Icon component.
 *
 * @param {*} props 		- The props for the component.
 * @param {string} props.color - The color of the icon.
 * @returns {JSX.Element} 	- The Icon component.
 */
export default function Icon({ color = "unsplash" }) {
	return (
		<span
			className={classnames("instant-images-sidebar-icon", "color-" + color)}
		>
			<svg viewBox="0 0 31 58" width="13px" height="24px">
				<title>Instant Images Logo</title>
				<polygon
					points="20 0 20 23 31 23 11 58 11 34 0 34 20 0"
					fill="#4a7bc5"
				/>
			</svg>
		</span>
	);
}
