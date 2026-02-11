import { __ } from '@wordpress/i18n';
import { usePluginContext } from '../../../common/pluginProvider';
import { API } from '../../../constants/API';
import { IconLogo } from '../../../components/Icon';

// Use configured provider order if available, otherwise fall back to defaults.
const providerOrder = instant_img_localize?.provider_order || [];
const providers = providerOrder.length ? providerOrder.map((slug) => slug.charAt(0).toUpperCase() + slug.slice(1)) : API.providers;

/**
 * Render the block header.
 *
 * @param {Object} props                The component props.
 * @param {Object} props.switchProvider The function to switch the provider.
 * @return {JSX.Element} The BlockHeader component.
 */
export default function BlockHeader({ switchProvider }) {
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
				<label className="offscreen">{__('Select Provider', 'instant-images')}</label>
				<select defaultValue={provider} onChange={(e) => providerChange(e.target.value)}>
					<option value="">-- {__('Select Provider', 'instant-images')} --</option>
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
