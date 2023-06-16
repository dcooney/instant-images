<?php
/**
 * Plugin header.
 *
 * @package InstantImages
 */

?>
<header class="instant-images-header-wrap">
	<h1>
		<?php echo esc_attr( INSTANT_IMAGES_TITLE ); ?> <em><?php echo esc_attr( INSTANT_IMAGES_VERSION ); ?></em>
		<?php echo wp_kses_post( InstantImages::instant_images_get_tagline() ); ?>
	</h1>
	<?php
	if ( $show_settings ) {
		?>
	<a href="<?php echo esc_url( INSTANT_IMAGES_WPADMIN_SETTINGS_URL ); ?>" class="button button-secondary button-large">
		<i class="fa fa-cog" aria-hidden="true"></i> <?php esc_attr_e( 'Settings', 'instant-images' ); ?>
	</a>
		<?php } ?>
</header>
