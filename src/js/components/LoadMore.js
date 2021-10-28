import React from "react";

class LoadMore extends React.Component {
	constructor(props) {
		super(props);
		this.loadMorePhotos = this.props.loadMorePhotos.bind(this);
	}
	render() {
		return (
			<div className="load-more-wrap">
				<button
					type="button"
					className="button"
					onClick={() => this.loadMorePhotos()}
				>
					{instant_img_localize.load_more}
				</button>
			</div>
		);
	}
}

export default LoadMore;
