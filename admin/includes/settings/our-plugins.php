<?php
/**
 * Our plugins template.
 *
 * @package InstantImages
 */

if ( class_exists( 'Connekt_Plugin_Installer' ) ) {
	?>
<section class="settings-entry" id="our-plugins">
	<div class="settings-entry--title">
		<i class="fa fa-plug" aria-hidden="true"></i>
		<h2><?php esc_attr_e( 'Our Plugins', 'instant-images' ); ?></h2>
		<p><?php esc_attr_e( 'Check out some of our other WordPress plugins.', 'instant-images' ); ?></p>
	</div>
	<div class="settings-entry--action other-plugins">
		<?php
		$instant_images_plugin_array = array(
			array(
				'slug' => 'ajax-load-more',
			),
			array(
				'slug' => 'block-manager',
			),
			array(
				'slug' => 'easy-query',
			),
			array(
				'slug' => 'velocity',
			),
		);
		?>
		<?php Connekt_Plugin_Installer::init( $instant_images_plugin_array ); ?>
	</div>
</section>
<?php } ?>
