import { useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import classNames from "classnames";
import { getSetting, saveSettings } from "../../functions/localStorage";

/* eslint-disable */

/**
 * Generic CTA for the Extended add-on.
 *
 * @return {JSX.Element} The ExtendedCTA component.
 */
export function ExtendedCTA() {
	const { activated = false } = instant_img_localize?.addons?.extended;
	const name = "extended-cta-2024";
	const [dissmissed, setDismissed] = useState(getSetting(name) === "hide"); // Get setting from localstorage.

	// Hide the CTA.
	function remove() {
		saveSettings(name, "hide");
		setDismissed(true);
	}

	return (
		<>
			{!activated && !dissmissed ? (
				<div className="cta-extended cta-extended--standard">
					<i className="fa fa-bullhorn" aria-hidden="true"></i>
					<p>
						<span>
							Introducing the{" "}
							<a
								href="https://getinstantimages.com/add-ons/extended/"
								target="_blank"
								rel="noreferrer"
							>
								Extended add-on
							</a>
						</span>{" "}
						&rarr; An extension pack of premium features and functionality to enhance the Instant Images plugin.
					</p>
					<div>
						<a
							href="https://getinstantimages.com/add-ons/extended/"
							target="_blank"
							rel="noreferrer"
							className="button button-primary"
						>
							{__("Learn More", "instant-images")}
						</a>
						<button
							type="button"
							className="button button-secondary"
							onClick={() => remove()}
							aria-label={__("Dismiss", "instant-images")}
						>
							{__("Dismiss", "instant-images")}
						</button>
					</div>
				</div>
			) : null}
		</>
	);
}

/**
 * CTA for the Extended add-on in the search dropdown.
 *
 * @param {Object}  props      The component props.
 * @param {boolean} props.show Display the component.
 * @return {JSX.Element}       The ExtendedSearchCTA component.
 */
export function ExtendedSearchCTA({ show = false }) {
	const name = "extended-cta-search-2024";
	const [active, setActive] = useState(getSetting(name) !== "hide"); // Get setting from localstorage.

	// Hide the CTA.
	function remove() {
		saveSettings(name, "hide");
		setActive(false);
	}

	return (
		<div
			className={classNames(
				"control-nav--search-history extended-cta",
				show && active ? "active" : null
			)}
		>
			<div className="cta-extended cta-extended--search">
				<button
					type="button"
					className="closeBtn"
					onClick={() => remove()}
					aria-label={__("Dismiss", "instant-images")}
				>
					&times;
					<span className="offscreen">{__("Dismiss", "instant-images")}</span>
				</button>
				<div>
					<p>
						<i className="fa fa-magic" aria-hidden="true"></i>
						Enable search suggestions, history, and maintain current search term while switching providers with the{" "}
						<a
							href="https://getinstantimages.com/add-ons/extended/"
							target="_blank"
							rel="noreferrer"
						>
							Extended add-on
						</a>
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
