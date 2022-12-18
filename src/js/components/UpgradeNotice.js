import React from "react";

class UpgradeNotice extends React.Component {
	constructor(props) {
		super(props);
		this.ref = React.createRef();
	}

	/**
	 * Dismiss Notice.
	 *
	 * @since 3.2
	 */
	dismiss() {
		const self = this;
		const url =
			instant_img_localize.root + "instant-images/v5_upgrade_dismissal/"; // REST Route
		const request = new XMLHttpRequest();
		request.open("POST", url, true);
		request.setRequestHeader("X-WP-Nonce", instant_img_localize.nonce);
		request.setRequestHeader("Content-Type", "application/json");
		request.send();
		request.onload = function() {
			if (request.status === 200) {
				if (self.ref.current) {
					self.ref.current.remove();
				}
			}
		};
		request.onerror = function(errorMsg) {
			console.warn(errorMsg);
		};
	}

	render() {
		return (
			<React.Fragment>
				{!instant_img_localize.v5_upgrade_notice.transient ? (
					<div
						className="upgrade-notice notice notice-warning"
						ref={this.ref}
					>
						<p>
							<strong>
								{instant_img_localize.v5_upgrade_notice.disclaimer}
							</strong>
							<br />
							<span
								dangerouslySetInnerHTML={{
									__html: instant_img_localize.v5_upgrade_notice.text
								}}
							/>
							<br />
							<span className="links">
								<a
									href="https://connekthq.com/plugins/instant-images/terms-of-use/"
									target="_blank"
								>
									{instant_img_localize.v5_upgrade_notice.terms}
								</a>{" "}
								|{" "}
								<a
									href="https://connekthq.com/plugins/instant-images/privacy-policy/"
									target="_blank"
								>
									{instant_img_localize.v5_upgrade_notice.privacy}
								</a>
							</span>
						</p>
						<div>
							<button className="button" onClick={() => this.dismiss()}>
								{instant_img_localize.v5_upgrade_notice.dismiss}
							</button>
						</div>
					</div>
				) : null}
			</React.Fragment>
		);
	}
}

export default UpgradeNotice;
