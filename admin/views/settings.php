<?php
/**
 * Instant Images page settings.
 *
 * @package InstantImages
 */

?>
<section class="instant-images-settings instant-img-container">
	<?php require_once INSTANT_IMAGES_PATH . 'admin/includes/settings/header.php'; ?>
	<div class="instant-images-settings--sections">
		<?php
		// General Settings.
		require_once INSTANT_IMAGES_PATH . 'admin/includes/settings/general-settings.php';

		// API Settings.
		require_once INSTANT_IMAGES_PATH . 'admin/includes/settings/api-settings.php';

		// Extended: Image Import.
		if ( InstantImages::instant_images_addon_valid_license( 'extended' ) ) {
			require_once INSTANT_IMAGES_EXTENDED_PATH . 'views/import.php';
		}

		// Licenses.
		require_once INSTANT_IMAGES_PATH . 'admin/includes/settings/licenses.php';

		// What's New.
		require_once INSTANT_IMAGES_PATH . 'admin/includes/settings/whats-new.php';

		// Our Plugins.
		require_once INSTANT_IMAGES_PATH . 'admin/includes/settings/our-plugins.php';
		?>
	</div>
</div>
