import "./licenses";

const instant_images = instant_images || {};
jQuery(document).ready(function ($) {
	"use strict";

	// Media Uploader Modal
	instant_images.setEditor = function (frame) {
		const Parent = wp.media.view.Router;
		wp.media.view.Router = Parent.extend({
			addNav() {
				// Button
				const $a = $(
					'<a href="#" class="media-menu-item"><i class="fa fa-bolt" aria-hidden="true"></i> ' +
						instant_img_localize.instant_images +
						"</a>"
				);

				// Click event
				$a.on("click", function (e) {
					e.preventDefault();
					// Set active state of #instant_images_modal
					frame.addClass("active");
				});

				this.$el.append($a); // append
			},

			initialize() {
				Parent.prototype.initialize.apply(this, arguments);
				this.addNav(); // add buttons
				return this; // return
			},
		});

		if (frame.length) {
			$(".close-ii-modal").on("click", function (e) {
				e.preventDefault();
				frame.removeClass("active");
			});
		}
	};

	if (wp.media) {
		const frame = $("#instant_images_modal");
		if (frame.length) {
			instant_images.setEditor(frame);
		}
	}

	// Close Modal.
	$(document).on("click", ".media-modal-backdrop", function (e) {
		e.preventDefault();
		frame.removeClass("active");
	});

	// Save Settings Form.
	$(".instant-images-settings form.settings").on("submit", function () {
		const form = $(this);
		form.addClass("saving");
		$(".save-settings .loading", form).addClass("active");
		$(".save-settings #submit", form).prop("disabled", true);
		$(this).ajaxSubmit({
			success() {
				$(".save-settings .loading", form).removeClass("active");
				setTimeout(function () {
					$(".save-settings .saved", form).addClass("active");
					setTimeout(function () {
						$(".save-settings .saved", form).removeClass("active");
						form.removeClass("saving");
						$(".save-settings #submit", form).prop("disabled", false);
					}, 2000);
				}, 250);
			},
			error() {
				form.removeClass("saving");
				$(".save-settings .loading", form).removeClass("active");
				$(".save-settings #submit", form).prop("disabled", false);
				alert("An error occured and the settings could not be saved"); // eslint-disable-line no-alert
			},
		});
		return false;
	});

	// Settings anchor links.
	const settings = document.querySelectorAll(
		".settings_page_instant-images-settings .settings-entry"
	);
	if (settings) {
		const hash = window.location.hash;
		if (hash) {
			scrollToSection(hash);
		}
		const nav = document.querySelector(
			".settings_page_instant-images-settings nav.jump-nav"
		);
		settings.forEach(function (setting) {
			const anchor = setting.getAttribute("id");
			const icon = setting.querySelector(".settings-entry--title .fa");
			const text = setting.querySelector(".settings-entry--title h2").innerText;

			const button = document.createElement("button");
			button.setAttribute("data-anchor", anchor);
			button.innerHTML = icon.outerHTML + text;
			nav.appendChild(button);

			// Scroll to section.
			button.addEventListener("click", function () {
				scrollToSection("#" + anchor);
			});
		});
	}
});

/**
 * Scroll to section hash.
 *
 * @param {string} hash The section ID.
 */
function scrollToSection(hash) {
	const target = document.querySelector(hash);
	if (target) {
		history.replaceState({}, "", hash);
		window.scrollTo({
			top: target.offsetTop - 20,
			behavior: "smooth",
		});
	}
}
