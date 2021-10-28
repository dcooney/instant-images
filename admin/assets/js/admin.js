var instant_images = instant_images || {};

jQuery(document).ready(function ($) {
	"use strict";

	var speed = 350;

	// Media Uploader
	instant_images.setEditor = function (frame) {
		// vars
		var Parent = wp.media.view.Router;

		wp.media.view.Router = Parent.extend({
			addNav: function () {
				// Button
				var $a = $(
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

			initialize: function () {
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
		var frame = $("#instant_images_modal");
		if (frame.length) {
			instant_images.setEditor(frame);
		}
	}

	// Close
	$(document).on("click", ".media-modal-backdrop", function (e) {
		//alert("meow");
		e.preventDefault();
		frame.removeClass("active");
	});

	// Show Settings
	var settingsDiv = $(".instant-images-settings");
	$(".header-wrap button").on("click", function () {
		var el = $(this);
		if (settingsDiv.hasClass("active")) {
			settingsDiv.slideUp(speed, function () {
				el.find("i").removeClass("fa-close").addClass("fa-cog");
				settingsDiv.removeClass("active");
			});
		} else {
			settingsDiv.slideDown(speed, function () {
				el.find("i").addClass("fa-close").removeClass("fa-cog");
				settingsDiv.addClass("active");
			});
		}
	});

	// Close
	$(document).on("keyup", function (e) {
		if (e.key === "Escape" && settingsDiv && settingsDiv.hasClass("active")) {
			$(".header-wrap button").trigger("click");
		}
	});

	// Save Form
	$("#unsplash-form-options").on("submit", function () {
		$(".save-settings .loading").fadeIn();
		$(this).ajaxSubmit({
			success: function () {
				$(".save-settings .loading").fadeOut(speed, function () {
					window.location.reload();
				});
			},
			error: function () {
				$(".save-settings .loading").fadeOut();
				alert("Sorry, settings could not be saved");
			},
		});
		return false;
	});
});
