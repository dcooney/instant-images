<?php
/**
 * API settings template.
 *
 * @package InstantImages
 */

?>
<section class="settings-entry" id="licenses">
	<div class="settings-entry--title">
		<i class="fa fa-unlock-alt" aria-hidden="true"></i>
		<h2><?php esc_attr_e( 'Licenses', 'instant-images' ); ?></h2>
		<p><?php esc_attr_e( 'Enter your Instant Images licenses keys to unlock various features and functionality.', 'instant-images' ); ?></p>
	</div>
	<div class="settings-entry--action general-settings">
		<form action="options.php" method="post" class="settings">
			<?php
				settings_fields( 'instant_images_api_settings_group' );
				do_settings_sections( 'instant-images-api' );
			?>
			<?php require INSTANT_IMAGES_PATH . 'admin/includes/settings/save.php'; ?>
		</form>
	</div>
</section>
