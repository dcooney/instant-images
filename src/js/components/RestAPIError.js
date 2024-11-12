import { Fragment, useState, useEffect } from '@wordpress/element';

/**
 * Render the RestAPIError component.
 *
 * @return {JSX.Element} The RestAPIError component.
 */
export default function RestAPIError() {
	const [access, setAccess] = useState(true);

	/**
	 * Test users access to the REST API endpoint.
	 *
	 * @since 3.2
	 */
	function test() {
		const testURL = instant_img_localize.root + 'instant-images/test/';
		const restAPITest = new XMLHttpRequest();
		restAPITest.open('POST', testURL, true);
		restAPITest.setRequestHeader('X-WP-Nonce', instant_img_localize.nonce);
		restAPITest.setRequestHeader('Content-Type', 'application/json');
		restAPITest.send();
		restAPITest.onload = function () {
			if (restAPITest.status >= 200 && restAPITest.status < 400) {
				const response = JSON.parse(restAPITest.response);
				const success = response.success;
				if (!success) {
					setAccess(false);
				}
			} else {
				setAccess(false);
			}
		};
		restAPITest.onerror = function (errorMsg) {
			console.warn(errorMsg);
			setAccess(false);
		};
	}

	useEffect(() => {
		test();
	}, []);

	return (
		<Fragment>
			{!access ? (
				<div className="error-messaging">
					<strong>{instant_img_localize.error_restapi}</strong>
					{instant_img_localize.error_restapi_desc}
				</div>
			) : null}
		</Fragment>
	);
}
