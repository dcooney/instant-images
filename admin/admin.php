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
 * @author ConnektMedia <support@connekthq.com>
 * @since 2.0
 */
function instant_images_create_page() {
	// Media submenu page.
	$instant_images_media_page = add_submenu_page(
		'upload.php',
		INSTANT_IMAGES_TITLE,
		INSTANT_IMAGES_TITLE,
		apply_filters( 'instant_images_user_role', 'upload_files' ),
		INSTANT_IMAGES_NAME,
		'instant_images_media_page'
	);
	add_action( 'load-' . $instant_images_media_page, 'instant_images_load_app_scripts' ); // Add admin scripts.

	// Options/Settings submenu page.
	$instant_images_settings_page = add_submenu_page(
		'options-general.php',
		INSTANT_IMAGES_TITLE,
		INSTANT_IMAGES_TITLE,
		apply_filters( 'instant_images_settings_user_role', 'manage_options' ),
		INSTANT_IMAGES_NAME . '-settings',
		'instant_images_settings_page'
	);
	add_action( 'load-' . $instant_images_settings_page, 'instant_images_load_settings_scripts' ); // Add admin scripts.
}
add_action( 'admin_menu', 'instant_images_create_page' );

/**
 * Settings/Options page.
 *
 * @author ConnektMedia <support@connekthq.com>
 * @since 5.3
 */
function instant_images_settings_page() {
	require_once INSTANT_IMAGES_PATH . 'admin/views/settings.php';
}

/**
 * Media page.
 *
 * @author ConnektMedia <support@connekthq.com>
 * @since 2.0
 */
function instant_images_media_page() {
	$show_settings = true;
	echo '<div class="instant-img-container" data-media-popup="false">';
	include INSTANT_IMAGES_PATH . 'admin/views/app.php';
	echo '</div>';
}

/**
 * Load scripts for the Instant Images application.
 *
 * @author ConnektMedia <support@connekthq.com>
 * @since 1.0
 */
function instant_images_load_app_scripts() {
	add_action( 'admin_enqueue_scripts', 'instant_images_enqueue_scripts' );
}

/**
 * Load scripts for the settings page.
 *
 * @author ConnektMedia <support@connekthq.com>
 * @since 1.0
 */
function instant_images_load_settings_scripts() {
	add_action( 'admin_enqueue_scripts', 'instant_images_settings_scripts' );
}

/**
 * Admin Enqueue Scripts.
 *
 * @author ConnektMedia <support@connekthq.com>
 * @since 2.0
 */
function instant_images_enqueue_scripts() {
	instant_images_scripts();
}

/**
 * Load the required application scripts and localized vars.
 *
 * @author ConnektMedia <support@connekthq.com>
 * @since 3.0
 */
function instant_images_scripts() {
	wp_enqueue_style( 'admin-instant-images', INSTANT_IMAGES_URL . 'build/style-instant-images".css', '', INSTANT_IMAGES_VERSION );
	wp_enqueue_script( 'instant-images-react', INSTANT_IMAGES_URL . 'build/instant-images".js', [ 'wp-element' ], INSTANT_IMAGES_VERSION, true );
	InstantImages::instant_img_localize();
}

/**
 * Load the required settings scripts.
 *
 * @author ConnektMedia <support@connekthq.com>
 * @since 5.3
 */
function instant_images_settings_scripts() {
	wp_enqueue_style( 'admin-instant-images', INSTANT_IMAGES_URL . 'build/style-instant-images".css', '', INSTANT_IMAGES_VERSION );
	wp_enqueue_script( 'jquery', true, '', INSTANT_IMAGES_VERSION, false );
	wp_enqueue_script( 'jquery-form', true, '', INSTANT_IMAGES_VERSION, false );
	wp_enqueue_script( 'instant-images', INSTANT_IMAGES_ADMIN_URL . 'assets/js/admin.js', 'jquery', INSTANT_IMAGES_VERSION, true );
}

/**
 * Add tab to media upload window (left hand sidebar).
 *
 * @param array $tabs Current tabs.
 * @author ConnektMedia <support@connekthq.com>
 * @since 3.2.1
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
 * @author ConnektMedia <support@connekthq.com>
 * @since 3.2.1
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
 *
 * @author ConnektMedia <support@connekthq.com>
 * @since 3.2.1
 */
function instant_images_media_upload_handler() {
	wp_iframe( 'instant_images_media_tab' );
}
add_action( 'media_upload_instant_img_tab', 'instant_images_media_upload_handler' );

/**
 * Add pop up content to edit, new and post pages on classic editor screens.
 *
 * @author ConnektMedia <support@connekthq.com>
 * @since 2.0
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
 * @author ConnektMedia <support@connekthq.com>
 * @since 2.0
 */
function instant_images_filter_admin_footer_text( $text ) {
	$screen     = get_current_screen();
	$base_array = [
		'media_page_' . INSTANT_IMAGES_NAME,
		'settings_page_' . INSTANT_IMAGES_NAME . '-settings',
	];

	if ( in_array( $screen->base, $base_array, true ) ) {
		$divider = '<em>|</em>';
		// @codingStandardsIgnoreStart
		echo INSTANT_IMAGES_TITLE . ' is made with <span style="color: #e25555;">♥</span> by <a href="https://connekthq.com/?utm_source=WPAdmin&utm_medium=InstantImages&utm_campaign=Footer" target="_blank" style="font-weight: 500;">Connekt</a> &rarr; <a href="https://wordpress.org/support/plugin/instant-images/reviews/#new-post" target="_blank" style="font-weight: 500;">Reviews</a> ' . $divider . ' <a href="https://getinstantimages.com/frequently-asked-questions/" target="_blank" style="font-weight: 500;">FAQ</a> ' . $divider . ' <a href="https://getinstantimages.com/terms-of-use/" target="_blank" style="font-weight: 500;">Terms</a> ' . $divider . ' <a href="https://getinstantimages.com/privacy-policy/" target="_blank" style="font-weight: 500;">Privacy Policy</a>';
		// @codingStandardsIgnoreEnd
	}
}
add_filter( 'admin_footer_text', 'instant_images_filter_admin_footer_text' ); // Admin menu text.
