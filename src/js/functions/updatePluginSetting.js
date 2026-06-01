import axios from 'axios';

/**
 * Update plugin settings by specific key/value pair.
 *
 * @param {string} setting The previous provider.
 * @param {string} value   The value to save.
 */
export default function updatePluginSetting(setting, value) {
	const api = instant_img_localize?.root + 'instant-images/settings/';

	const params = {
		setting,
		value,
	};

	const config = {
		headers: {
			'X-WP-Nonce': instant_img_localize.nonce,
			'Content-Type': 'application/json',
		},
	};

	axios
		.post(api, JSON.stringify(params), config)
		.then(function () {})
		.catch(function (error) {
			console.warn(error);
		});
}
