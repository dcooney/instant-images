import { __ } from "@wordpress/i18n";
import { usePluginContext } from "../../../common/pluginProvider";
import { API } from "../../../constants/API";
import { IconLogo } from "../../../components/Icon";
const providers = API.providers;

/**
 * Render the block header.
 *
 * @param {Object} props The component props.
 * @return {JSX.Element} The BlockHeader component.
 */
export default function BlockHeader(props) {
	const { switchProvider } = props;
	const { provider } = usePluginContext();

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
						-- {__("Select Provider", "instant-images")} --
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
