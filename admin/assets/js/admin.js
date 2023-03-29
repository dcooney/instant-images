var instant_images = instant_images || {};

jQuery(document).ready(function ($) {
	"use strict";

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
		e.preventDefault();
		frame.removeClass("active");
	});

	// Save Form.
	$(".instant-images-settings form").on("submit", function () {
		var form = $(this);
		$(".save-settings .loading", form).addClass("active");
		$(".save-settings #submit", form).prop("disabled", true);
		$(this).ajaxSubmit({
			success: function () {
				$(".save-settings .loading", form).removeClass("active");
				setTimeout(function () {
					$(".save-settings .saved", form).addClass("active");
					setTimeout(function () {
						$(".save-settings .saved", form).removeClass("active");
						$(".save-settings #submit", form).prop("disabled", false);
					}, 2000);
				}, 250);
			},
			error: function () {
				$(".save-settings .loading", form).removeClass("active");
				$(".save-settings #submit", form).prop("disabled", false);
				alert("An error occured and the settings could not be saved");
			},
		});
		return false;
	});
});
