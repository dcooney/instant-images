import { Fragment, useRef } from '@wordpress/element';
import classNames from 'classnames';
import { usePluginContext } from '../common/pluginProvider';
import getErrorMessage from '../functions/getErrorMessage';
import { gotoURL } from '../functions/helpers';
import { getProviderIcon } from './ProviderIcons';

/**
 * Render the ErrorLightbox component.
 * Note: Component is display on initial plugin load if the default provider has an invalid API key.
 *
 * @return {JSX.Element} The ErrorLightbox component.
 */
export default function ErrorLightbox() {
	const { provider, apiError } = usePluginContext();
	const lightbox = useRef();
	const status = apiError?.status ? apiError.status : null;

	return (
		<Fragment>
			{apiError && status && (
				<div className={classNames('api-lightbox', 'error-lightbox', 'active')} ref={lightbox} tabIndex="-1">
					<div>
						<div className={classNames('api-lightbox--details', 'error-lightbox')}>
							<h3>
								{getProviderIcon(provider)}
								{provider}
							</h3>
							<p className="callout-warning">
								{status} {instant_img_localize.error}
							</p>
							<p>{getErrorMessage(status)}</p>
							<p className="more-info">{instant_img_localize.api_default_provider}</p>
							<p className="action-controls">
								<button onClick={() => gotoURL(instant_img_localize[`${provider}_api_url`])}>{instant_img_localize.get_api_key}</button>
							</p>
						</div>
					</div>
				</div>
			)}
		</Fragment>
	);
}
