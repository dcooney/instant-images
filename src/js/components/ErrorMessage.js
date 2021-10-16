import React from "react";

class ErrorMessage extends React.Component {
	render() {
		return (
			<div className="error-messaging">
				<span
					dangerouslySetInnerHTML={{
						__html: `${instant_img_localize.error_restapi}${instant_img_localize.error_restapi_desc}`,
					}}
				></span>
			</div>
		);
	}
}
export default ErrorMessage;
