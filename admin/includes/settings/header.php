<?php
/**
 * Settings header template.
 *
 * @package InstantImages
 */

?>
<div class="instant-images-settings--header">
	<div class="instant-images-settings--sticky">
		<div class="instant-images-header-wrap-alt">
			<h1>
				<?php echo esc_attr( INSTANT_IMAGES_TITLE ); ?>
				<?php echo wp_kses_post( InstantImages::instant_images_get_tagline() ); ?>
			</h1>
			<p>
				<a href="<?php echo esc_url( INSTANT_IMAGES_WPADMIN_URL ); ?>" class="button button-secondary button-large">
					<?php esc_attr_e( 'Get Images', 'instant-images' ); ?>
				</a>
			</p>
		</div>
		<nav class="jump-nav">
			<h3><?php esc_attr_e( 'Jump to Section', 'instant-images' ); ?></h3>
		</nav>
		<div class="plugin-version"><?php esc_attr_e( 'Plugin Version:', 'instant-images' ); ?> <strong><?php echo esc_attr( INSTANT_IMAGES_VERSION ); ?></strong></div>
	</div>
</div>
