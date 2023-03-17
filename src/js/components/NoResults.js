/**
 * Render the NoResults component.
 *
 * @param {Object} props The component props.
 * @return {JSX.Element} The NoResults component.
 */
export default function NoResults(props) {
	const { total = 0, is_search = false } = props;

	if (!is_search || (is_search && total >= 1)) {
		// Bail if not search or search total is greater than 1.
		return null;
	}

	return (
		<div className="no-results">
			<div>
				<h3>{instant_img_localize.no_results} </h3>
				<p>{instant_img_localize.no_results_desc} </p>
			</div>
		</div>
	);
}
