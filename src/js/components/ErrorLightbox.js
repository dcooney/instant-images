import React from "react";
import consoleStatus from "../functions/consoleStatus";
import getErrorMessage from "../functions/getErrorMessage";

class ErrorLightbox extends React.Component {
	constructor(props) {
		super(props);
		this.lightbox = React.createRef();
		this.error = this.props.error;
		this.provider = this.props.provider;
		this.escFunction = this.escFunction.bind(this);
		this.status = this.error.status ? this.error.status : 401;
		consoleStatus(this.provider, this.status);
	}

	/**
	 * Close the lightbox
	 */
	closeLightbox() {
		const self = this;
		self.lightbox.current.classList.remove("active");
		setTimeout(function() {
			self.lightbox.current.remove();
		}, 275);
	}

	/**
	 * Close the lightbox with a background click.
	 */
	bkgClick(e) {
		const target = e.target;
		// If clicked element is the background.
		if (target === this.lightbox.current) {
			this.closeLightbox();
		}
	}

	/**
	 * Escape handler.
	 *
	 * @param {Event} e The key press event.
	 */
	escFunction(e) {
		if (e.keyCode === 27) {
			this.closeLightbox();
		}
	}

	/**
	 * Open the API window.
	 *
	 * @param {string} url The destination URL.
	 */
	gotoURL(url) {
		window.open(url, "_blank");
	}

	componentDidMount() {
		document.addEventListener("keydown", this.escFunction, false);
		this.lightbox.current.classList.add("active");
	}

	componentWillUnmount() {
		document.removeEventListener("keydown", this.escFunction, false);
	}

	render() {
		return (
			<div
				className="api-lightbox"
				ref={this.lightbox}
				onClick={e => this.bkgClick(e)}
				tabIndex="-1"
			>
				<div>
					<button
						className="api-lightbox--close"
						onClick={() => this.closeLightbox()}
					>
						&times;
						<span className="offscreen">
							{instant_img_localize.btnClose}
						</span>
					</button>

					<div className="api-lightbox--details error-lightbox">
						<h3 data-provider={this.provider}>{this.provider}</h3>
						<p className="callout-warning">
							{this.status} {instant_img_localize.error}
						</p>
						<p>{getErrorMessage(this.status)}</p>
						<p className="action-controls">
							<button
								onClick={() =>
									this.gotoURL(
										instant_img_localize[`${this.provider}_api_url`]
									)
								}
							>
								{instant_img_localize.get_api_key}
							</button>
						</p>
					</div>
				</div>
			</div>
		);
	}
}
export default ErrorLightbox;
