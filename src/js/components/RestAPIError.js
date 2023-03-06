/**
 * Render the RestAPIError component.
 *
 * @return {JSX.Element} The RestAPIError component.
 */
export default function RestAPIError() {
	return (
		<div
			className="error-messaging"
			dangerouslySetInnerHTML={{
				__html: `<strong>${instant_img_localize.error_restapi}</strong>${instant_img_localize.error_restapi_desc}`,
			}}
		></div>
	);
}
