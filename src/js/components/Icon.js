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

/**
 * The SVG Logo.
 *
 * @return {JSX.Element} The IconLogo component.
 */
export function IconLogo() {
	return (
		<svg
			width="80"
			height="80"
			viewBox="0 0 80 80"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>Instant Images Icon</title>
			<path
				d="M0 8C0 3.58172 3.58172 0 8 0H72C76.4183 0 80 3.58172 80 8V72C80 76.4183 76.4183 80 72 80H8C3.58172 80 0 76.4183 0 72V8Z"
				fill="#647FE8"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M36.5 65L52.5 36.5816H44.4385V16.1215L27 44.0693H36.5V65Z"
				fill="white"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M36.5 65L52.5 36.5816H44.4385V16.1215L27 44.0693H36.5V65Z"
				fill="white"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M36.5 65L52.5 36.5817H44.4385L36.5 44.0693V65Z"
				fill="#C7D2FF"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M36.5 65L52.5 36.5817H44.4385L36.5 44.0693V65Z"
				fill="#C7D2FF"
			/>
		</svg>
	);
}
