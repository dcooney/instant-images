<?php
/**
 * API settings template.
 *
 * @package InstantImages
 */

?>
<section class="settings-entry" id="api-settings">
	<div class="settings-entry--title">
		<i class="fa fa-key" aria-hidden="true"></i>
		<h2><?php esc_attr_e( 'API Keys (Providers)', 'instant-images' ); ?></h2>
		<p><?php esc_attr_e( 'Replace the default Instant Images API keys with your own.', 'instant-images' ); ?></p>
		<p class="small"><?php esc_attr_e( 'Leave these fields empty to restore the default plugin keys.', 'instant-images' ); ?></p>
	</div>
	<div class="settings-entry--action api-settings">
		<form action="options.php" method="post" class="settings">
			<?php
				settings_fields( 'instant_images_api_settings_group' );
				do_settings_sections( 'instant-images-api' );
			?>
			<?php require INSTANT_IMAGES_PATH . 'admin/includes/settings/save.php'; ?>
		</form>
	</div>
</section>
