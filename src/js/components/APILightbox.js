import React from "react";
//import API from "../constants/API";

class APILightbox extends React.Component {
	constructor(props) {
		super(props);
		this.provider = this.props.provider;
		this.setOrientation = this.props.setOrientation.bind(this);
		this.options = API[this.provider].orientation;
	}
}
export default APILightbox;
