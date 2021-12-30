import buildURL from "./buildURL";
import getQueryParams from "./getQueryParams";

/**
 * Function to trigger download action at unsplash.com.
 * This is used to give authors download credits and nothing more.
 *
 * @param {object} vars Variables passed from component.
 * @param {string} id   The ID of the image
 * @since 3.1
 */
export default function unsplashDownload(vars, id) {
	const download_url = `${vars.api_provider.photo_api}${id}/download`;
	const params = getQueryParams("unsplash");
	const url = buildURL(download_url, params);

	fetch(url)
		.then((data) => data.json())
		.then(function (data) {
			// Success, nothing else happens here
			console.log("Image download successsfully triggered at Unsplash.");
		})
		.catch(function (error) {
			console.log(error);
		});
}
