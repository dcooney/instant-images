import { Fragment } from "@wordpress/element";
import { API } from "../constants/API";
import { usePluginContext } from "../common/pluginProvider";
const providers = API.providers; // Get current provider settings.

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
					{providers.map((item, iterator) => (
						<div key={`provider-${iterator}`}>
							<button
								data-provider={item.toLowerCase()}
								onClick={(e) => switchProvider(e)}
								className={
									provider === item.toLowerCase()
										? "provider-nav--btn active"
										: "provider-nav--btn"
								}
							>
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
