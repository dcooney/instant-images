import { capitalizeFirstLetter } from "./helpers";
import getErrorMessage from "./getErrorMessage";

/**
 * Display a console.warn message about API status.
 *
 * @param {string} provider The API service provider.
 * @param {string} status   The API status.
 */
export default function consoleStatus(provider, status = 200) {
	const local = instant_img_localize;
	const message = getErrorMessage(status);
	switch (status) {
		case 400:
		case 401:
		case 500:
			// Unsplash/Pixabay/Pexels incorrect API key
			console.warn(
				`[${local.instant_images} - ${status} Error] ${capitalizeFirstLetter(
					provider
				)}: ${message}`
			);
			break;

		case 429:
			/**
			 * Pixabay, Pexels - too many requests.
			 *
			 * @see https://www.pexels.com/api/documentation/#statistics
			 * @see https://pixabay.com/api/docs/#api_rate_limit
			 */
			console.warn(
				`[${local.instant_images} - ${status} Error] ${capitalizeFirstLetter(
					provider
				)}: ${message}`
			);
			break;
		default:
			break;
	}
}
