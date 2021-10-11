import React from "react";

class NoResults extends React.Component {
	render() {
		return (
			<div className="no-results">
				<h3>{instant_img_localize.no_results} </h3>
				<p>{instant_img_localize.no_results_desc} </p>
			</div>
		);
	}
}

export default NoResults;
