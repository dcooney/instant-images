/**
 * The Icon component.
 *
 * @return {JSX.Element} 	    The Icon component.
 */
export default function Icon() {
	return (
		<span className="instant-images-sidebar-icon">
			<IconSVG />
		</span>
	);
}

/**
 * The SVG icon.
 *
 * @return {JSX.Element} The IconSVG component.
 */
export function IconSVG() {
	return (
		<svg viewBox="0 0 31 58" width="13px" height="24px">
			<polygon points="20 0 20 23 31 23 11 58 11 34 0 34 20 0" fill="#4a7bc5" />
		</svg>
	);
}
