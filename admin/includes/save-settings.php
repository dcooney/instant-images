<?php
/**
 * Save settings template.
 *
 * @package InstantImages
 */

?>
<div class="save-settings">
	<?php submit_button( __( 'Save Settings', 'instant-images' ) ); ?>
	<div class="loading"></div>
	<div class="saved">
		<i class="fa fa-check-circle-o" aria-hidden="true"></i>
		<?php esc_attr_e( 'Settings Saved', 'instant-images' ); ?>
	</div>
	<div class="clear"></div>
</div>
