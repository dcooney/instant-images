import axios from "axios";
import { __ } from "@wordpress/i18n";

// Get all license forms.
const licenseForms = document.querySelectorAll(
	".license-settings form.license-settings--item"
);

if (licenseForms) {
	// Loop each formt o add event listener.
	licenseForms.forEach((form) => {
		form.addEventListener("submit", function (e) {
			e.preventDefault();
			const input = this.querySelector("input");
			const license = input.value;
			const key = input.dataset.key;
			const status = input.dataset.status;
			const id = input.dataset.id;
			const type = form.classList.contains("valid") ? "deactivate" : "activate";

			if (!license) {
				input.focus();
				return;
			}

			const button = form.querySelector("input[type=submit]");
			button.setAttribute("disabled", "disabled");

			const loading = form.querySelector(".loading");
			loading.classList.add("active");

			updateLicense({
				key,
				status,
				id,
				license,
				type,
			});
		});
	});
}

/**
 * Update add-on license via REST API.
 *
 * @param {Object} params The data params for license activation/deactivation.
 */
function updateLicense(params) {
	const { root, nonce } = instant_img_admin_localize; // eslint-disable-line no-undef
	const api = root + "instant-images/license/";
	const config = {
		headers: {
			"X-WP-Nonce": nonce,
			"Content-Type": "application/json",
		},
	};
	axios
		.post(api, JSON.stringify(params), config)
		.then(function (data) {
			if (data?.data) {
				location.reload(); // Success: reload window.
			} else {
				console.warn(
					// Error handling.
					__("Are you sure you should be doing this?", "instant-images")
				);
				doReload();
			}
		})
		.catch(function (error) {
			console.warn(error);
			doReload();
		});
}

/**
 * Reload window after 2 seconds.
 */
function doReload() {
	setTimeout(function () {
		location.reload(); // reload window.
	}, 2000);
}
