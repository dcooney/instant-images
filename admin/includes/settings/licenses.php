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
		<p><?php esc_attr_e( 'Enter add-on license keys to enable plugin functionality and dashboard updates.', 'instant-images' ); ?></p>
	</div>
	<div class="settings-entry--action license-settings">
		<?php instant_images_display_licenses(); ?>
	</div>
</section>
