import { Fragment, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import classNames from "classnames";
import { usePluginContext } from "../../common/pluginProvider";
import {
	clearSearchHistory,
	getSetting,
	saveSettings,
} from "../../functions/localStorage";

/**
 * The History list component.
 *
 * @param {Object} props The component props.
 * @return {JSX.Element} The SearchHistory component.
 */
export default function SearchHistory(props) {
	const { suggestions } = usePluginContext();
	const { show, history, setHistory, setSearchValue } = props;

	return (
		<div
			className={classNames(
				"control-nav--search-history",
				show ? "active" : null
			)}
			role="listbox"
		>
			{!!suggestions.length && (
				<Fragment>
					<div className="control-nav--search-history-title">
						<div>{__("Suggestions", "instant-images")}</div>
					</div>
					<ul role="listbox" className="search-suggestions">
						{suggestions.map((item, key) => (
							<li key={key} role="option">
								<button type="button" onClick={() => setSearchValue(item)}>
									{item}
								</button>
							</li>
						))}
					</ul>
				</Fragment>
			)}
			{!!history.length && (
				<Fragment>
					<div className="control-nav--search-history-title">
						<div>{__("Recent Searches", "instant-images")}</div>
						<button
							type="button"
							onClick={() => {
								clearSearchHistory();
								setHistory([]);
							}}
						>
							{__("Clear", "instant-images")}
						</button>
					</div>
					<ul role="listbox" className="search-history">
						{history.map((item, key) => (
							<li key={key} role="option">
								<button
									type="button"
									className="history"
									onClick={() => setSearchValue(item)}
								>
									{item}
								</button>
							</li>
						))}
					</ul>
				</Fragment>
			)}
		</div>
	);
}

/**
 * A CTA for the Extended add-on.
 *
 * @param {Object}  props      The component props.
 * @param {boolean} props.show Display the component.
 * @return {JSX.Element}       The ExtendedCTA component.
 */
export function ExtendedCTA({ show = false }) {
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
