<?php
/**
 * General settings template.
 *
 * @package InstantImages
 */

?>
<section class="settings-entry" id="general-settings">
	<div class="settings-entry--title">
		<i class="fa fa-cog" aria-hidden="true"></i>
		<h2><?php esc_attr_e( 'General Settings', 'instant-images' ); ?></h2>
		<p><?php esc_attr_e( 'Manage your Instant Images plugin settings.', 'instant-images' ); ?></p>
	</div>
	<div class="settings-entry--action general-settings">
		<form action="options.php" method="post" class="settings">
			<?php
				settings_fields( 'instant_images_general_settings_group' );
				do_settings_sections( 'instant-images' );
			?>
			<?php
			require INSTANT_IMAGES_PATH . 'admin/includes/settings/save.php';
			?>
		</form>
	</div>
</section>
