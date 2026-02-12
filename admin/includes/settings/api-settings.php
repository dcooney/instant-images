<?php
/**
 * API settings template.
 *
 * @package InstantImages
 */

?>
<section class="settings-entry" id="api-settings">
	<div class="settings-entry--title">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
			<path d="M336 352c97.2 0 176-78.8 176-176S433.2 0 336 0 160 78.8 160 176c0 18.7 2.9 36.8 8.3 53.7L7 391c-4.5 4.5-7 10.6-7 17l0 80c0 13.3 10.7 24 24 24l80 0c13.3 0 24-10.7 24-24l0-40 40 0c13.3 0 24-10.7 24-24l0-40 40 0c6.4 0 12.5-2.5 17-7l33.3-33.3c16.9 5.4 35 8.3 53.7 8.3zM376 96a40 40 0 1 1 0 80 40 40 0 1 1 0-80z"/>
		</svg>
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
