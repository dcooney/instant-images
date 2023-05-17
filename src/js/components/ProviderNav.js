import { Fragment } from "@wordpress/element";
import { usePluginContext } from "../common/pluginProvider";
import { API } from "../constants/API";
import { getProviderIcon } from "./ProviderIcons";
const providers = API.providers;

/**
 * Render the ProviderNav component.
 *
 * @param {Object} props The component props.
 * @return {JSX.Element} The ProviderNav component.
 */
export default function ProviderNav(props) {
	const { switchProvider } = props;
	const { provider } = usePluginContext();
	return (
		<Fragment>
			{!!providers?.length && (
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
	);
}
