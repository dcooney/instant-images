class RestAPIError extends React.Component {
	render() {
		return (
			<div
				className="error-messaging"
				dangerouslySetInnerHTML={{
					__html: `<strong>${instant_img_localize.error_restapi}</strong>${instant_img_localize.error_restapi_desc}`,
				}}
			></div>
		);
	}
}
export default RestAPIError;
