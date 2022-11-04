import React from "react";

class LoadFail extends React.Component {
	constructor(props) {
		super(props);
		this.provider = this.props.provider;

		const title = instant_img_localize.error_on_load_title;
		this.title = title.replace(
			"{provider}",
			this.capitalizeFirstLetter(this.props.provider)
		);
	}

	capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	render() {
		return (
			<div className="onload-warning">
				<h3>{this.title}</h3>
				<p>{instant_img_localize.error_on_load}</p>
			</div>
		);
	}
}

export default LoadFail;
