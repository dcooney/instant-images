import React from "react";
import API from "../constants/API";

class Orientation extends React.Component {
	constructor(props) {
		super(props);
		this.provider = this.props.provider;
		this.setOrientation = this.props.setOrientation.bind(this);
		this.options = API[this.provider].orientation;
	}
	render() {
		return (
			<div className="orientation-list">
				<span>
					<i className="fa fa-filter" aria-hidden="true"></i>{" "}
					{instant_img_localize.orientation}:
				</span>
				<ul>
					{this.options &&
						this.options.map((option, iterator) => (
							<li
								key={`${iterator}-${option}`}
								tabIndex="0"
								onClick={(e) => this.setOrientation(option, e)}
								onKeyPress={(e) => this.setOrientation(option, e)}
							>
								{instant_img_localize[option]}
							</li>
						))}
				</ul>
			</div>
		);
	}
}

export default Orientation;
