<?php
/**
 * API settings template.
 *
 * @package InstantImages
 */

?>
<section class="settings-entry" id="licenses">
	<div class="settings-entry--title">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
			<path d="M448 32c-35.3 0-64 28.7-64 64l0 64 32 0c35.3 0 64 28.7 64 64l0 224c0 35.3-28.7 64-64 64l-256 0c-35.3 0-64-28.7-64-64l0-224c0-35.3 28.7-64 64-64l160 0 0-64c0-70.7 57.3-128 128-128S576 25.3 576 96l0 32c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-32c0-35.3-28.7-64-64-64zM328 360c13.3 0 24-10.7 24-24s-10.7-24-24-24l-80 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l80 0z"/>
		</svg>
		<h2><?php esc_attr_e( 'Licenses', 'instant-images' ); ?></h2>
		<p><?php esc_attr_e( 'Enter add-on license keys to enable plugin functionality and dashboard updates.', 'instant-images' ); ?></p>
	</div>
	<div class="settings-entry--action license-settings">
		<?php instant_images_display_licenses(); ?>
	</div>
</section>
