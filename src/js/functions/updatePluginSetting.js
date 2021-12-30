import axios from "axios";

/**
 * Update plugin settings by specific key/value pair.
 *
 * @param {string} provider The previous provider.
 * @param {string} value 	 The value to save.
 */
export default function updatePluginSetting(setting, value) {
	// API URL
	const api = instant_img_localize.root + "instant-images/settings/";

	// Data Params
	const data = {
		setting,
		value,
	};

	// Config Params
	const config = {
		headers: {
			"X-WP-Nonce": instant_img_localize.nonce,
			"Content-Type": "application/json",
		},
	};

	axios
		.post(api, JSON.stringify(data), config)
		.then(function (res) {
			const response = res.data;
		})
		.catch(function (error) {
			console.log(error);
		});
}
