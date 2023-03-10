/**
 * Render the LoadingBlock component.
 *
 * @param {Object} props The component props.
 * @param {Boolean} props.loading Is the app loading.
 * @returns {JSX.Element} The LoadingBlock component.
 */
export default function LoadingBlock({ loading }) {
	if (!loading) {
		return null;
	}
	return <div className="loading-block" />;
}
