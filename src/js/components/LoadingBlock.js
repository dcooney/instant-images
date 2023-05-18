import classNames from "classnames";
import { API } from "../constants/API";

/**
 * Render the LoadingBlock component.
 *
 * @param {Object}  props         The component props.
 * @param {boolean} props.loading Is the app loading.
 * @param {boolean} props.total   Total amount of results.
 * @return {JSX.Element}          The LoadingBlock component.
 */
export default function LoadingBlock({ loading, total = 0 }) {
	if (!loading || total < API.defaults.per_page) {
		// Bail early if not loading or total is less than the default per page.
		return null;
	}
	return (
		<div className={classNames("loading-block", loading ? "loading" : null)} />
	);
}
