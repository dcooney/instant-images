import { useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import classNames from "classnames";
import { getSetting, saveSettings } from "../../functions/localStorage";

/**
 * A CTA for the Extended add-on.
 *
 * @param {Object}  props      The component props.
 * @param {boolean} props.show Display the component.
 * @return {JSX.Element}       The ExtendedCTA component.
 */
export default function ExtendedCTA({ show = false }) {
	const [active, setActive] = useState(
		getSetting("extended-cta-search") !== "hide"
	); // Get setting from localstorage.

	// Hide the CTA.
	function hideCTA() {
		saveSettings("extended-cta-search", "hide");
		setActive(false);
	}

	return (
		<div
			className={classNames(
				"control-nav--search-history extended-cta",
				show && active ? "active" : null
			)}
		>
			<div>
				<button type="button" className="closeBtn" onClick={() => hideCTA()}>
					&times;
					<span className="offscreen">{__("Hide", "instant-images")}</span>
				</button>
				<div>
					<p>
						<i className="fa fa-magic" aria-hidden="true"></i>
						Enable search suggestions and history with the Instant Images{" "}
						<a
							href="https://getinstantimages.com/add-ons/extended/"
							target="_blank"
							rel="noreferrer"
						>
							<strong>Extended add-on</strong>
						</a>
						.
					</p>
					<p>
						<a
							href="https://getinstantimages.com/add-ons/extended/"
							target="_blank"
							rel="noreferrer"
							className="button button-primary"
						>
							{__("Learn More", "instant-images")}
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}
