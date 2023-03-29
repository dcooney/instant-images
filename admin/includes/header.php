<?php
/**
 * Plugin header.
 *
 * @package InstantImages
 */

?>
<header class="header-wrap">
	<h1>
		<?php echo esc_attr( INSTANT_IMAGES_TITLE ); ?> <em><?php echo esc_attr( INSTANT_IMAGES_VERSION ); ?></em>
		<span>
		<?php
			// translators: Instant Images tagline.
			$instant_images_tagline = __( 'One click photo uploads from %1$s, %2$s, %3$s and %4$s.', 'instant-images' ); // phpcs:ignore
			echo sprintf( $instant_images_tagline, '<a href="https://unsplash.com/" target="_blank">Unsplash</a>', '<a href="https://wordpress.org/openverse" target="_blank">Openverse</a>', '<a href="https://pixabay.com/" target="_blank">Pixabay</a>', '<a href="https://pexels.com/" target="_blank">Pexels</a>' );  // phpcs:ignore
		?>
	</h1>
	<?php
	if ( $show_settings ) {
		?>
	<a href="<?php admin_url(); ?>options-general.php?page=<?php echo esc_attr( INSTANT_IMAGES_NAME . '-settings' ); ?>" class="button button-secondary button-large">
		<i class="fa fa-cog" aria-hidden="true"></i> <?php esc_attr_e( 'Settings', 'instant-images' ); ?>
	</a>
		<?php } else { ?>
	<a href="<?php admin_url(); ?>upload.php?page=<?php echo esc_attr( INSTANT_IMAGES_NAME ); ?>" class="button button-secondary button-large">
		<i class="fa fa-download" aria-hidden="true"></i> <?php esc_attr_e( 'Get Images', 'instant-images' ); ?>
	</a>
		<?php } ?>
</header>
