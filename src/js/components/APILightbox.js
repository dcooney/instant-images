import { useRef, useEffect, useState } from '@wordpress/element';
import classNames from 'classnames';
import FocusTrap from 'focus-trap-react';
import { buildTestURL } from '../functions/buildURL';
import consoleStatus from '../functions/consoleStatus';
import { checkRateLimit } from '../functions/helpers';
import updatePluginSetting from '../functions/updatePluginSetting';

/**
 * Render the APILightbox component.
 * Note: Component is display when switching providers and the API is invalid.
 *
 * @param {Object} props The component props.
 * @return {JSX.Element} The APILightbox component.
 */
export default function APILightbox(props) {
	const { provider, closeAPILightbox } = props;
	if (!provider) {
		return null;
	}

	const [apiStatus, setAPIStatus] = useState('invalid');
	const [response, setResponse] = useState('');

	const lightbox = useRef();
	const inputRef = useRef();
	const submitRef = useRef();
	const api_key = instant_img_localize[`${provider}_app_id`];
	const title = apiStatus === 'invalid' ? instant_img_localize.api_key_invalid : '';

	/**
	 * Handler for the form submission.
	 *
	 * @param {Event} e The form event.
	 */
	async function handleSubmit(e) {
		e.preventDefault();
		setAPIStatus('loading');

		const key = inputRef?.current?.value; // Get API key value.
		instant_img_localize[`${provider}_app_id`] = key; // Set API key to localized variable.

		// Update the matching provider API key in the Instant Images settings.
		const settingField = document.querySelector(`input[name="instant_img_settings[${provider}_api]"]`);
		if (settingField) {
			settingField.value = key;
		}

		// Update plugin settings via REST API.
		updatePluginSetting(`${provider}_api`, key);

		try {
			// Fetch API data.
			const response = await fetch(buildTestURL(provider));

			// Handle response.
			const { ok, status, headers } = response;
			checkRateLimit(headers);

			// Handle response actions.
			if (ok) {
				// Success.
				setAPIStatus('valid');
				setResponse(instant_img_localize.api_success_msg);
				setTimeout(function () {
					closeAPILightbox(provider);
				}, 1500);
			} else {
				setAPIStatus('invalid'); // Error/Invalid.
				consoleStatus(provider, status); // Render console warning.

				if (status === 400 || status === 401) {
					setResponse(instant_img_localize.api_invalid_msg); // Unsplash/Pixabay incorrect API key.
				}
				if (status === 429) {
					setResponse(instant_img_localize.api_ratelimit_msg); // Pixabay - too many requests.
				}
			}
		} catch (error) {
			setAPIStatus('invalid'); // Error/Invalid.
			consoleStatus(provider, 500); // Render console warning.
			setResponse(instant_img_localize.api_invalid_500_msg);
		}
	}

	/**
	 * Close the lightbox
	 */
	function closeLightbox() {
		if (lightbox?.current) {
			lightbox.current.classList.remove('active');
			setTimeout(function () {
				closeAPILightbox();
			}, 150);
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

	/**
	 * Reset the key to use Instant Images default.
	 */
	function useDefaultKey() {
		inputRef.current.value = '';
		setTimeout(function () {
			submitRef.current.click();
		}, 25);
	}

	useEffect(() => {
		document.addEventListener('keydown', escFunction, false);
		lightbox.current.classList.add('active');
		return () => {
			document.removeEventListener('keydown', escFunction, false);
		};
	}, []);

	return (
		<FocusTrap>
			<div className="api-lightbox" ref={lightbox} onClick={(e) => bkgClick(e)} tabIndex="-1">
				<div>
					<div>
						<button className="api-lightbox--close" onClick={() => closeLightbox()}>
							&times;
							<span className="offscreen">{instant_img_localize.btnClose}</span>
						</button>
						<div className="api-lightbox--details">
							<h3 data-provider={provider}>{provider}</h3>
							<p>{instant_img_localize[`${provider}_api_desc`]}</p>
							<p className="action-controls">
								<button onClick={() => gotoURL(instant_img_localize[`${provider}_api_url`])}>{instant_img_localize.get_api_key}</button>
								<span>|</span>
								<button onClick={() => useDefaultKey()}>{instant_img_localize.use_instant_images_key}</button>
							</p>
						</div>
						<form onSubmit={(e) => handleSubmit(e)}>
							<label htmlFor="key" className="offscreen">
								{instant_img_localize.enter_api_key}
							</label>
							<div className="api-lightbox--input-wrap">
								<span className={apiStatus} title={title && title}>
									{apiStatus === 'invalid' && <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>}
									{apiStatus === 'valid' && <i className="fa fa-check-circle" aria-hidden="true"></i>}
									{apiStatus === 'loading' && <i className="fa fa-spinner fa-spin" aria-hidden="true"></i>}
								</span>
								<input type="text" id="key" ref={inputRef} placeholder="Enter API Key" defaultValue={api_key}></input>
							</div>
							{response && <p className={classNames('api-lightbox--response', apiStatus)}>{response}</p>}
							<button type="submit" ref={submitRef}>
								{instant_img_localize.btnVerify}
							</button>
						</form>
					</div>
				</div>
			</div>
		</FocusTrap>
	);
}
