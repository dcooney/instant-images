import { useRef, Fragment, useEffect } from '@wordpress/element';
import classNames from 'classnames';
import consoleStatus from '../functions/consoleStatus';
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
	 * Close the lightbox
	 */
	function closeLightbox() {
		if (lightbox?.current) {
			lightbox.current.classList.remove('active');
			setTimeout(function () {
				lightbox.current.remove();
			}, 275);
		}
	}

	/**
	 * Close the lightbox with a background click.
	 */
	function bkgClick(e) {
		const target = e.target;
		// If clicked element is the background.
		if (target === lightbox?.current) {
			closeLightbox();
		}
	}

	/**
	 * Escape handler.
	 *
	 * @param {Event} e The key press event.
	 */
	function escFunction(e) {
		const { key } = e;
		if (key === 'Escape') {
			closeLightbox();
		}
	}

	/**
	 * Open the API window.
	 *
	 * @param {string} url The destination URL.
	 */
	function gotoURL(url) {
		window.open(url, '_blank');
	}

	useEffect(() => {
		document.addEventListener('keydown', escFunction, false);
		return () => {
			document.removeEventListener('keydown', escFunction, false);
		};
	}, []);

	return (
		<Fragment>
			{error && status && (
				<div className={classNames('api-lightbox', 'active')} ref={lightbox} onClick={(e) => bkgClick(e)} tabIndex="-1">
					<div>
						<button className="api-lightbox--close" onClick={() => closeLightbox()}>
							&times;
							<span className="offscreen">{instant_img_localize.btnClose}</span>
						</button>

						<div className={classNames('api-lightbox--details', 'error-lightbox')}>
							<h3 data-provider={provider}>{provider}</h3>
							<p className="callout-warning">
								{status} {instant_img_localize.error}
							</p>
							<p>{getErrorMessage(status)}</p>
							<p className="more-info">{instant_img_localize.api_default_provider}</p>
							<p className="action-controls">
								<button onClick={() => gotoURL(instant_img_localize[`${provider}_api_url`])}>{instant_img_localize.get_api_key}</button>
								<span>|</span>
								<button onClick={() => closeLightbox()}>{instant_img_localize.btnCloseWindow}</button>
							</p>
						</div>
					</div>
				</div>
			)}
		</Fragment>
	);
}
