/**
 * Get props per provider from API results.
 *
 * @param {string} provider  The current service provider.
 * @param {object} result    The photo object.
 * @param {string} attribute The attribute to match.
 * @return {string}          The value as a string.
 */
export default function getProp(provider, result, attribute) {
	let value = "";
	switch (attribute) {
		case "thumb":
			if (provider === "pixabay") {
				value = result.previewURL;
			}
			if (provider === "unsplash") {
				value = result.urls.thumb;
			}
			break;

		case "img":
			if (provider === "pixabay") {
				value = result.webformatURL;
			}
			if (provider === "unsplash") {
				value = result.urls.small;
			}
			break;

		case "full_size":
			if (provider === "pixabay") {
				value = result.largeImageURL;
			}
			if (provider === "unsplash") {
				value = result.urls.full;
			}
			break;

		case "author":
			if (provider === "pixabay") {
				value = result.user;
			}
			if (provider === "unsplash") {
				value = result.user.name;
			}
			break;

		case "user":
			if (provider === "pixabay") {
				value = result.user_id;
			}
			if (provider === "unsplash") {
				value = result.user.username;
			}
			break;

		case "name":
			if (provider === "pixabay") {
				value = result.user;
			}
			if (provider === "unsplash") {
				value = result.user.name;
			}
			break;

		case "user_photo":
			if (provider === "pixabay") {
				value = result.userImageURL;
			}
			if (provider === "unsplash") {
				value = result.user.profile_image.small;
			}
			break;

		case "user_url":
			if (provider === "pixabay") {
				value = `${instant_img_localize.pixabay_url}/users/${result.user}-${result.user_id}/`;
			}
			if (provider === "unsplash") {
				value = `${instant_img_localize.unsplash_url}/@${result.user.username}?utm_source=wordpress-instant-images&utm_medium=referral`;
			}
			break;

		case "link":
			if (provider === "pixabay") {
				value = result.pageURL;
			}
			if (provider === "unsplash") {
				value = result.links.html;
			}
			break;

		case "likes":
			if (provider === "pixabay") {
				value = result.likes;
			}
			if (provider === "unsplash") {
				value = result.likes;
			}
			break;
	}

	return value;
}
