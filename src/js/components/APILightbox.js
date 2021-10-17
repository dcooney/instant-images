import FocusTrap from "focus-trap-react";
import React from "react";
import API from "../constants/API";

class APILightbox extends React.Component {
	constructor(props) {
		super(props);
		this.lightbox = React.createRef();
		this.provider = this.props.provider;
		this.api_key = instant_img_localize[`${this.provider}_app_id`];
		this.inputRef = React.createRef();
		this.loading = false;
		this.state = { status: "invalid" };
		this.afterVerifiedAPICallback =
			this.props.afterVerifiedAPICallback.bind(this);
		this.closeAPILightbox = this.props.closeAPILightbox.bind(this);
		this.escFunction = this.escFunction.bind(this);
	}

	/**
	 * Handler for the form submission.
	 *
	 * @param {Event} e The form event.
	 */
	async handleSubmit(e) {
		e.preventDefault();
		const self = this;

		this.setState({ status: "loading" });

		const key = this.inputRef.current.value;

		const api = API[this.provider];
		const url = `${api.photo_api}${api.api_query_var}${key}&per_page=10&page=1`;

		// Fetch API data.
		const response = await fetch(url);

		// Handle response.
		const ok = response.ok;
		const status = response.status;

		// Set localized variable.
		instant_img_localize[`${this.provider}_app_id`] = key;

		// Update the specific provider API key in the Instant Images settings.
		const settingField = document.querySelector(
			`input[name="instant_img_settings[${this.provider}_api]"]`
		);
		if (settingField) {
			settingField.value = key;
		}

		// Handle response actions.
		if (ok) {
			// Success.
			this.setState({ status: "valid" });
			setTimeout(function () {
				self.afterVerifiedAPICallback(self.provider);
			}, 250);
		} else {
			// Error/Invalid.
			this.setState({ status: "invalid" });
			if (status === 400 || status === 401) {
				// Unsplash/Pixabay incorrect API key.
				console.warn(
					`${instant_img_localize.instant_images}: ${status} Error - ${instant_img_localize.api_invalid_msg}`
				);
			}
			if (status === 429) {
				console.warn(
					`${instant_img_localize.instant_images}: ${instant_img_localize.api_ratelimit_msg}`
				);
			}
		}
	}

	/**
	 * Close the lightbox
	 */
	closeLightbox() {
		this.closeAPILightbox(this.provider);
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

	componentDidMount() {
		document.addEventListener("keydown", this.escFunction, false);
	}

	componentWillUnmount() {
		document.removeEventListener("keydown", this.escFunction, false);
	}

	render() {
		const title =
			this.state.status === "invalid"
				? instant_img_localize.api_key_invalid
				: "";
		return (
			<FocusTrap>
				<div className="api-lightbox" ref={this.lightbox}>
					<div>
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
							<p>Pixabay requires an API key.</p>
							<form onSubmit={(e) => this.handleSubmit(e)}>
								<hr />
								<label htmlFor="key">
									{instant_img_localize.enter_api_key}
								</label>
								<div className="api-lightbox--input-wrap">
									<span
										className={this.state.status}
										title={title && title}
									>
										{this.state.status === "invalid" && (
											<i
												className="fa fa-exclamation-triangle"
												aria-hidden="true"
											></i>
										)}
										{this.state.status === "valid" && (
											<i
												className="fa fa-check-circle"
												aria-hidden="true"
											></i>
										)}
										{this.state.status === "loading" && (
											<i
												className="fa fa-spinner fa-spin"
												aria-hidden="true"
											></i>
										)}
									</span>
									<input
										type="text"
										id="key"
										ref={this.inputRef}
										placeholder="Enter API Key"
										defaultValue={this.api_key}
									></input>
								</div>
								<button type="submit">
									{instant_img_localize.btnVerify}
								</button>
							</form>
						</div>
					</div>
				</div>
			</FocusTrap>
		);
	}
}
export default APILightbox;
