<?php
/**
 * Instant Images admin functions.
 *
 * @package InstantImages
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Create admin menu item under 'Media'.
 *
 * @since 2.0
 * @author ConnektMedia <support@connekthq.com>
 */
function instant_images_create_page() {
	$usplash_settings_page = add_submenu_page(
		'upload.php',
		INSTANT_IMAGES_TITLE,
		INSTANT_IMAGES_TITLE,
		apply_filters( 'instant_images_user_role', 'upload_files' ),
		INSTANT_IMAGES_NAME,
		'instant_images_settings_page'
	);
	add_action( 'load-' . $usplash_settings_page, 'instant_images_load_scripts' ); // Add admin scripts.
}
add_action( 'admin_menu', 'instant_images_create_page' );

/**
 * Settings page callback.
 *
 * @since 2.0
 * @author ConnektMedia <support@connekthq.com>
 */
function instant_images_settings_page() {
	$show_settings = true;
	echo '<div class="instant-img-container" data-media-popup="false">';
	include INSTANT_IMAGES_PATH . 'admin/views/app.php';
	echo '</div>';
}

/**
 * Load Admin CSS and JS
 *
 * @since 1.0
 * @author ConnektMedia <support@connekthq.com>
 */
function instant_images_load_scripts() {
	add_action( 'admin_enqueue_scripts', 'instant_images_enqueue_scripts' );
}

/**
 * Admin Enqueue Scripts
 *
 * @since 2.0
 * @author ConnektMedia <support@connekthq.com>
 */
function instant_images_enqueue_scripts() {
	instant_images_scripts();
}

/**
 * Localize vars and scripts.
 *
 * @since 3.0
 * @author ConnektMedia <support@connekthq.com>
 */
function instant_images_scripts() {
	$suffix = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';

	wp_enqueue_style( 'admin-instant-images', INSTANT_IMAGES_URL . 'dist/css/instant-images' . $suffix . '.css', '', INSTANT_IMAGES_VERSION );
	wp_enqueue_script( 'jquery', true, '', INSTANT_IMAGES_VERSION, false );
	wp_enqueue_script( 'jquery-form', true, '', INSTANT_IMAGES_VERSION, false );

	wp_enqueue_script( 'instant-images-react', INSTANT_IMAGES_URL . 'dist/js/instant-images' . $suffix . '.js', '', INSTANT_IMAGES_VERSION, true );
	wp_enqueue_script( 'instant-images', INSTANT_IMAGES_ADMIN_URL . 'assets/js/admin.js', 'jquery', INSTANT_IMAGES_VERSION, true );

	InstantImages::instant_img_localize();

}

/**
 * Add tab to media upload window (left hand sidebar).
 *
 * @param array $tabs Current tabs.
 * @since 3.2.1
 * @author ConnektMedia <support@connekthq.com>
 */
function instant_images_media_upload_tabs_handler( $tabs ) {
	$show_media_tab = InstantImages::instant_img_show_tab( 'media_modal_display' );
	if ( $show_media_tab ) {
		$newtab = array( 'instant_img_tab' => __( 'Instant Images', 'instant-images' ) );
		$tabs   = array_merge( $tabs, $newtab );
		return $tabs;
	}
}
add_filter( 'media_upload_tabs', 'instant_images_media_upload_tabs_handler' );

/**
 * Add Instant Images media button to classic editor screens.
 *
 * @since 3.2.1
 * @author ConnektMedia <support@connekthq.com>
 */
function instant_images_media_buttons() {
	$show_button = InstantImages::instant_img_show_tab( 'media_modal_display' );
	if ( $show_button ) {
		// @codingStandardsIgnoreStart
		echo '<a href="' . add_query_arg( 'tab', 'instant_img_tab', esc_url( get_upload_iframe_src() ) ) . '" class="thickbox button" title="' . esc_attr__( 'Instant Images', 'instant-images' ) . '">&nbsp;' . esc_attr__( 'Instant Images', 'instant-images' ) . '&nbsp;</a>';
		// @codingStandardsIgnoreEnd
	}
}
add_filter( 'media_buttons', 'instant_images_media_buttons' );

/**
 * Add instant images iframe to classic editor screens.
 *
 * @see https://developer.wordpress.org/reference/hooks/media_upload_tab/
 * @since 3.2.1
 * @author ConnektMedia <support@connekthq.com>
 */
// @codingStandardsIgnoreStart
function media_upload_instant_images_handler() {
	wp_iframe( 'instant_images_media_tab' );
}
add_action( 'media_upload_instant_img_tab', 'media_upload_instant_images_handler' );
// @codingStandardsIgnoreEnd

/**
 * Add pop up content to edit, new and post pages on classic editor screens.
 *
 * @since 2.0
 * @author ConnektMedia <support@connekthq.com>
 */
function instant_images_media_tab() {
	instant_images_scripts();
	$show_settings = false;
	?>
	<div class="instant-img-container editor" data-media-popup="true">
		<?php include INSTANT_IMAGES_PATH . 'admin/views/app.php'; ?>
	</div>
	<?php
}

/**
 * Filter the WP Admin footer text.
 *
 * @param string $text The footer display text.
 * @since 2.0
 * @author ConnektMedia <support@connekthq.com>
 */
function instant_images_filter_admin_footer_text( $text ) {
	$screen = get_current_screen();
	$base   = 'media_page_' . INSTANT_IMAGES_NAME;
	if ( $screen->base === $base ) {
		// @codingStandardsIgnoreStart
		echo INSTANT_IMAGES_TITLE . ' is made with <span style="color: #e25555;">♥</span> by <a href="https://connekthq.com/?utm_source=WPAdmin&utm_medium=InstantImages&utm_campaign=Footer" target="_blank" style="font-weight: 500;">Connekt</a> | <a href="https://wordpress.org/support/plugin/instant-images/reviews/#new-post" target="_blank" style="font-weight: 500;">Leave a Review</a> | <a href="https://connekthq.com/plugins/instant-images/faqs/" target="_blank" style="font-weight: 500;">FAQs</a> | <a href="https://connekthq.com/plugins/instant-images/terms-of-use/" target="_blank" style="font-weight: 500;">Terms</a> | <a href="https://connekthq.com/plugins/instant-images/privacy-policy/" target="_blank" style="font-weight: 500;">Privacy Policy</a>';
		// @codingStandardsIgnoreEnd
	}
}
add_filter( 'admin_footer_text', 'instant_images_filter_admin_footer_text' ); // Admin menu text.
