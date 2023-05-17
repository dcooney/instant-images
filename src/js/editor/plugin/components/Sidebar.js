import { useEffect, useRef, useState } from "@wordpress/element";
import InstantImages from "../../../components/InstantImages";
import buildURL from "../../../functions/buildURL";
import consoleStatus from "../../../functions/consoleStatus";
import getProvider from "../../../functions/getProvider";
import getQueryParams from "../../../functions/getQueryParams";
import { checkRateLimit } from "../../../functions/helpers";
import {
	deleteSession,
	getSession,
	saveSession,
} from "../../../functions/session";

/**
 * The image listing sidebar for the plugin sidebar.
 *
 * @return {JSX.Element} The Panel component.
 */
export default function Sidebar() {
	const [data, setData] = useState({});
	const containerRef = useRef();

	// Get provider and options from settings.
	const provider = getProvider();

	useEffect(() => {
		/**
		 * Fetch the initial provider results.
		 * Note: We must wrap our fetch call in an async await wrapper and then pass the provider
		 * as state. Otherwise React throws a 'Objects are not valid as a React child' error.
		 */
		async function initialize() {
			// Build URL.
			const params = getQueryParams(provider);
			const url = buildURL("photos", params);

			// Get session storage.
			const sessionData = getSession(url);
			if (sessionData) {
				// Display results from session.
				setData({ results: sessionData, error: null });
			} else {
				// Dispatch API fetch request.
				const response = await fetch(url);
				const { status, headers } = response;
				checkRateLimit(headers);

				try {
					// Get response data.
					const results = await response.json();
					const { error = null } = results;

					// Set results to state.
					setData({ results, error });
					saveSession(url, results);
				} catch (error) {
					consoleStatus(provider, status);
					deleteSession(url);
				}
			}
		}
		initialize();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div
			className="instant-img-container"
			data-editor="gutenberg-sidebar"
			ref={containerRef}
		>
			{data && data.results ? (
				<InstantImages
					editor="sidebar"
					data={data.results}
					api_error={data.error}
					provider={provider}
					container={containerRef?.current}
				/>
			) : null}
		</div>
	);
}
