<?php
/**
 * Instant Images Unsplash page layout.
 *
 * @package InstantImages
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
?>

<?php if ( $show_settings ) { ?>
<header class="header-wrap">
	<h1>
		<?php echo esc_attr( INSTANT_IMAGES_TITLE ); ?> <em><?php echo esc_attr( INSTANT_IMAGES_VERSION ); ?></em>
		<span>
		<?php
			// translators: Instant Images tagline.
			$instant_images_tagline = __( 'One click photo uploads from %1$s, %2$s, %3$s and %4$s.', 'instant-images' );
			// @codingStandardsIgnoreStart
			echo sprintf( $instant_images_tagline, '<a href="https://unsplash.com/" target="_blank">Unsplash</a>', '<a href="https://pixabay.com/" target="_blank">Pixabay</a>', '<a href="https://pexels.com/" target="_blank">Pexels</a>', '<a href="https://wordpress.org/openverse" target="_blank">Openverse</a>' );
			// @codingStandardsIgnoreEnd
		?>
	</h1>
	<button type="button" class="button button-secondary button-large">
		<i class="fa fa-cog" aria-hidden="true"></i> <?php esc_attr_e( 'Settings', 'instant-images' ); ?>
	</button>
</header>
<?php } ?>
<?php require INSTANT_IMAGES_PATH . 'admin/includes/cta/permissions.php'; ?>
<?php
if ( $show_settings ) {
	include INSTANT_IMAGES_PATH . 'admin/includes/page-settings.php';
}
?>
<section class="instant-images-wrapper">
	<div id="app"></div>
</section>
