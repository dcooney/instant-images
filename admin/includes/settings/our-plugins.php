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
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
			<path d="M128-32c17.7 0 32 14.3 32 32l0 96 128 0 0-96c0-17.7 14.3-32 32-32s32 14.3 32 32l0 96 64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l0 64c0 95.1-69.2 174.1-160 189.3l0 66.7c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-66.7C101.2 398.1 32 319.1 32 224l0-64c-17.7 0-32-14.3-32-32S14.3 96 32 96l64 0 0-96c0-17.7 14.3-32 32-32z"/>
		</svg>
		<h2><?php esc_attr_e( 'Our Plugins', 'instant-images' ); ?></h2>
		<p><?php esc_attr_e( 'Check out some of our other WordPress plugins.', 'instant-images' ); ?></p>
	</div>
	<div class="settings-entry--action other-plugins">
		<?php
		$instant_images_plugin_array = [
			[
				'slug' => 'ajax-load-more',
			],
			[
				'slug' => 'block-manager',
			],
			[
				'slug' => 'velocity',
			],
		];
		?>
		<?php Connekt_Plugin_Installer::init( $instant_images_plugin_array ); ?>
	</div>
</section>
<?php } ?>
