import React from "react";

class Advertisement extends React.Component {
	constructor(props) {
		super(props);
		const result = this.props.result;
		const { data = null } = result;
		this.url = data.url ? data.url : "";
		this.title = data.title ? data.title : "";
		this.desc = data.description ? data.description : "";
		this.avatar = data.avatar ? data.avatar : "";
		const { image = null } = data;
		this.image = image.src ? image.src : "";
		this.alt = image.alt ? image.alt : "";

		// Refs.
		this.photo = React.createRef();
		this.link = React.createRef();
	}

	render() {
		return (
			<React.Fragment>
				{this.image && this.url ? (
					<article
						className="photo feature"
						title={this.desc}
						ref={this.photo}
						onClick={() => this.link.current.click()}
					>
						<div className="photo--wrap">
							<span
								className="flag"
								title={instant_img_localize.advertisement}
							>
								{instant_img_localize.ad}
							</span>
							<div className="img-wrap">
								<a
									className="loaded"
									href={this.url}
									target="_blank"
									ref={this.link}
								>
									<img src={this.image} alt={this.alt} />
								</a>
							</div>
							<div className="feature-title">
								{this.avatar && (
									<img src={this.avatar} alt={this.title} />
								)}
								<span>{this.title}</span>
							</div>
						</div>
					</article>
				) : null}
			</React.Fragment>
		);
	}
}

export default Advertisement;
