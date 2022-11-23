import classNames from "classnames";
import FocusTrap from "focus-trap-react";
import React from "react";
import buildTestURL from "../functions/buildTestURL";
import consoleStatus from "../functions/consoleStatus";
import updatePluginSetting from "../functions/updatePluginSetting";

class APILightbox extends React.Component {
	constructor(props) {
		super(props);
		this.lightbox = React.createRef();
		this.provider = this.props.provider;
		this.api_key = instant_img_localize[`${this.provider}_app_id`];
		this.inputRef = React.createRef();
		this.submitRef = React.createRef();
		this.loading = false;
		this.state = { status: "invalid", response: "" };
		this.afterVerifiedAPICallback = this.props.afterVerifiedAPICallback.bind(
			this
		);
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

		let key = this.inputRef.current.value;
		const updateKey = key;
		if (!key) {
			key = instant_img_localize[`${this.provider}_default_app_id`];
		}

		// Set localized variable.
		instant_img_localize[`${this.provider}_app_id`] = key;

		// Update the matching provider API key in the Instant Images settings.
		const settingField = document.querySelector(
			`input[name="instant_img_settings[${this.provider}_api]"]`
		);
		if (settingField) {
			settingField.value = updateKey;
		}

		// Update plugin settings via REST API.
		updatePluginSetting(`${this.provider}_api`, updateKey);

		try {
			// Fetch API data.
			const response = await fetch(buildTestURL(self.provider));

			// Handle response.
			const { ok, status } = response;

			// Handle response actions.
			if (ok) {
				// Success.
				self.setState({
					status: "valid",
					response: instant_img_localize.api_success_msg
				});
				setTimeout(function() {
					self.afterVerifiedAPICallback(self.provider);
				}, 1500);
			} else {
				// Error/Invalid.
				this.setState({ status: "invalid" });

				// Render console warning.
				consoleStatus(self.provider, status);

				// Set response state.
				if (status === 400 || status === 401) {
					// Unsplash/Pixabay incorrect API key.
					self.setState({
						response: instant_img_localize.api_invalid_msg
					});
				}
				if (status === 429) {
					// Pixabay - too many requests.
					self.setState({
						response: instant_img_localize.api_ratelimit_msg
					});
				}
			}
		} catch (error) {
			// Error/Invalid.
			this.setState({ status: "invalid" });

			// Render console warning.
			consoleStatus(self.provider, 500);

			self.setState({
				response: instant_img_localize.api_invalid_500_msg
			});
		}
	}

	/**
	 * Close the lightbox
	 */
	closeLightbox() {
		const self = this;
		this.lightbox.current.classList.remove("active");
		setTimeout(function() {
			self.closeAPILightbox(this.provider);
		}, 250);
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

	/**
	 * Reset the key to use Instant Images default.
	 */
	useDefaultKey() {
		this.inputRef.current.value = "";
		this.submitRef.current.click();
	}

	componentDidMount() {
		document.addEventListener("keydown", this.escFunction, false);
		this.lightbox.current.classList.add("active");
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
				<div
					className="api-lightbox"
					ref={this.lightbox}
					onClick={e => this.bkgClick(e)}
					tabIndex="-1"
				>
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
							<div className="api-lightbox--details">
								<h3 data-provider={this.provider}>{this.provider}</h3>
								<p>
									{instant_img_localize[`${this.provider}_api_desc`]}
								</p>
								<p className="action-controls">
									<button
										onClick={() =>
											this.gotoURL(
												instant_img_localize[
													`${this.provider}_api_url`
												]
											)
										}
									>
										{instant_img_localize.get_api_key}
									</button>
									<span>|</span>
									<button onClick={() => this.useDefaultKey()}>
										{instant_img_localize.use_instant_images_key}
									</button>
								</p>
							</div>
							<form onSubmit={e => this.handleSubmit(e)}>
								<label htmlFor="key" className="offscreen">
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
								{this.state.response && (
									<p
										className={classNames(
											"api-lightbox--response",
											this.state.status
										)}
									>
										{this.state.response}
									</p>
								)}
								<button type="submit" ref={this.submitRef}>
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
