import { useRef, Fragment, useEffect } from '@wordpress/element';
import classNames from 'classnames';
import getErrorMessage from '../functions/getErrorMessage';

/**
 * Render the ErrorLightbox component.
 * Note: Component is display on initial plugin load if the default provider has an invalid API key.
 *
 * @param {Object} props The component props.
 * @return {JSX.Element} The ErrorLightbox component.
 */
export default function ErrorLightbox(props) {
	const { error, provider } = props;
	const lightbox = useRef();
	const status = error?.status ? error.status : null;

	/**
	 * Open the API window.
	 *
	 * @param {string} url The destination URL.
	 */
	function gotoURL(url) {
		window.open(url, '_blank');
	}

	return (
		<Fragment>
			{error && status && (
				<div className={classNames('api-lightbox', 'error-lightbox', 'active')} ref={lightbox} tabIndex="-1">
					<div>
						<div className={classNames('api-lightbox--details', 'error-lightbox')}>
							<h3 data-provider={provider}>{provider}</h3>
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
