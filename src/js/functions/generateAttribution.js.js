/**
 * Get the API URL for searches by ID.
 *
 * @param  {string} provider  The service provider.
 * @param  {string} url       The user url.
 * @param  {string} name      The user name.
 * @return {string}           The raw attribution HTML.
 */
export default function generateAttribution(provider, url, name) {
	let attribution = instant_img_localize.photo_by;

	switch (provider) {
		case "unsplash":
			attribution += ` <a href="${url}?utm_source=wordpress-instant-images&utm_medium=referral">${name}</a> on <a href="https://unsplash.com/?utm_source=wordpress-instant-images&utm_medium=referral">Unsplash</a>`;
			break;
		case "pixabay":
			attribution += ` <a href="${url}?utm_source=wordpress-instant-images&utm_medium=referral">${name}</a> on <a href="https://pixabay.com/?utm_source=wordpress-instant-images&utm_medium=referral">Pixabay</a>`;
			break;
	}

	return attribution;
}
