/**
 * Function to trigger download action at unsplash.com.
 * This is used to give authors download credits and nothing more.
 *
 * @param {object} vars Variables passed from component.
 * @param {string} id   The ID of the image
 * @since 3.1
 */
export default function unsplashDownload(vars, id) {
	const url = `${vars.api_provider.photo_api}/${id}/download?${vars.api_provider.api_query_var}${vars.api_key}`;
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
