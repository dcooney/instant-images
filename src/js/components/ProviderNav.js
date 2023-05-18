import { Fragment } from "@wordpress/element";
import { usePluginContext } from "../common/pluginProvider";
import { API } from "../constants/API";
import { getProviderIcon } from "./ProviderIcons";
import { IconLogo } from "./Icon";
const providers = API.providers;
import { __ } from "@wordpress/i18n";

/**
 * Render the ProviderNav component.
 *
 * @param {Object} props The component props.
 * @return {JSX.Element} The ProviderNav component.
 */
export default function ProviderNav(props) {
	const { switchProvider } = props;
	const { provider, wpBlock = false } = usePluginContext();

	/**
	 * Switch the provider via select.
	 *
	 * @param {string} value The provider value.
	 */
	function providerChange(value) {
		if (value) {
			switchProvider(value);
		}
	}

	/**
	 * Render the block header.
	 *
	 * @return {JSX.Element} The WPBlockHeader component.
	 */
	function WPBlockHeader() {
		return (
			<div className="instant-images-block--header">
				<div className="instant-images-block--header-logo">
					<IconLogo />
					<span>Instant Images</span>
				</div>
				<div className="instant-images-block--header-nav">
					<label className="offscreen">
						{__("Select Provider", "instant-images")}
					</label>
					<select
						defaultValue={provider}
						onChange={(e) => providerChange(e.target.value)}
					>
						<option value="">
							-- {__("Select a Provider", "instant-images")} --
						</option>
						{providers.map((item, index) => (
							<option key={index} value={item.toLowerCase()}>
								{item}
							</option>
						))}
					</select>
				</div>
			</div>
		);
	}

	return (
		<Fragment>
			{!!providers?.length && (
				<Fragment>
					{!!wpBlock ? (
						<WPBlockHeader />
					) : (
						<nav className="provider-nav">
							{providers.map((item, index) => (
								<div key={`provider-${index}`}>
									<button
										onClick={() => switchProvider(item.toLowerCase())}
										className={
											provider === item.toLowerCase()
												? "provider-nav--btn active"
												: "provider-nav--btn"
										}
									>
										{getProviderIcon(item)}
										<span>{item}</span>
										{API[item.toLowerCase()].new && (
											<span className="provider-nav--new">
												{instant_img_localize.new}
											</span>
										)}
									</button>
								</div>
							))}
						</nav>
					)}
				</Fragment>
			)}
		</Fragment>
	);
}
