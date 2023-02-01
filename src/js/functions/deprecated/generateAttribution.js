import capitalizeFirstLetter from "../capitalizeFirstLetter";

/**
 * Get the API URL for searches by ID.
 *
 * @param  {string} provider  The service provider.
 * @param  {string} url       The user url.
 * @param  {string} name      The user name.
 * @return {string}           The raw attribution HTML.
 * @deprecated 5.1.0
 */
export default function generateAttribution(provider, url, name) {
	const provider_url = `${provider}_url`;
	// const ref = "utm_source=wordpress-instant-images&utm_medium=referral";
	const loc = instant_img_localize;

	const attribution = `${
		loc.photo_by
	}${" "}<a href="${url}" rel="noopener noreferrer">${name}</a> ${
		loc.on
	} <a href="${loc[provider_url]}">${capitalizeFirstLetter(provider)}</a>`;

	return attribution;
}
