import capitalizeFirstLetter from "./capitalizeFirstLetter";

/**
 * Get the API URL for searches by ID.
 *
 * @param  {string} provider  The service provider.
 * @param  {string} url       The user url.
 * @param  {string} name      The user name.
 * @return {string}           The raw attribution HTML.
 */
export default function generateAttribution(provider, url, name) {
	const provider_url = `${provider}_url`;
	const referral = "utm_source=wordpress-instant-images&utm_medium=referral";
	const attribution = `${
		instant_img_localize.photo_by
	} ${" "}<a href="${url}" rel="nofollow">${name}</a> on <a href="${
		instant_img_localize[provider_url]
	}/?${referral}">${capitalizeFirstLetter(provider)}</a>`;

	return attribution;
}
