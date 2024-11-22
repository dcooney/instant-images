import { capitalizeFirstLetter } from './helpers';

/**
 * Get the API URL for searches by ID.
 *
 * @param {string} text      Attribution hook content.
 * @param {string} provider  Image provider.
 * @param {string} permalink Image url.
 * @param {Object} user      The user data.
 * @return {string}          The raw attribution HTML.
 */
export default function generateAttribution(text, provider, permalink, user) {
	if (!text || !provider || !permalink || !user) {
		return text;
	}

	// Get user data.
	const { name: username, url: user_url } = user;

	// Format provider data.
	const provider_url = instant_img_localize[`${provider}_url`];
	const provider_name = capitalizeFirstLetter(provider);

	// Generate attribution template.
	let attribution = text;
	attribution = attribution.replace('{username}', username);
	attribution = attribution.replace('{user_url}', user_url);
	attribution = attribution.replace('{image_url}', permalink);
	attribution = attribution.replace('{provider_url}', provider_url);
	attribution = attribution.replace('{provider}', provider_name);

	return attribution;
}
