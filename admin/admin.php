<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly


/**
 * Create admin menu item under 'Media'
 * @since 2.0
 */
function instant_img_create_page() {
   $usplash_settings_page = add_submenu_page(
   	'upload.php',
   	INSTANT_IMG_TITLE,
   	INSTANT_IMG_TITLE,
   	apply_filters('instant_images_user_role', 'upload_files'),
   	INSTANT_IMG_NAME,
   	'instant_img_settings_page'
   );
   add_action( 'load-' . $usplash_settings_page, 'instant_img_load_scripts' ); //Add our admin scripts
}
add_action( 'admin_menu', 'instant_img_create_page' );


/**
 * Settings page callback
 * @since 2.0
 */
function instant_img_settings_page(){
	$show_settings = true;
   echo '<div class="instant-img-container" data-media-popup="false">';
      include( INSTANT_IMG_PATH . 'admin/views/unsplash.php');
   echo '</div>';
}


/**
 * Load Admin CSS and JS
 * @since 1.0
 */
function instant_img_load_scripts(){
	add_action( 'admin_enqueue_scripts', 'instant_img_enqueue_scripts' );
}


/**
 * Admin Enqueue Scripts
 * @since 2.0
 */
function instant_img_enqueue_scripts(){
	instant_img_scripts();
}


/**
 * Localize vars and scripts
 * @since 3.0
 */
function instant_img_scripts(){
   $suffix = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min'; // Use minified libraries if SCRIPT_DEBUG is turned off

	wp_enqueue_style('admin-instant-images', INSTANT_IMG_URL. 'dist/css/instant-images'. $suffix .'.css', '', INSTANT_IMAGES_VERSION);
   wp_enqueue_script('jquery');
   wp_enqueue_script('jquery-form', true);

   wp_enqueue_script('instant-images-react', INSTANT_IMG_URL. 'dist/js/instant-images'. $suffix .'.js', '', INSTANT_IMAGES_VERSION, true);
   wp_enqueue_script('instant-images', INSTANT_IMG_ADMIN_URL. 'assets/js/admin.js', 'jquery', INSTANT_IMAGES_VERSION, true);

	InstantImages::instant_img_localize();

}


/**
 * Add tab to media upload window (left hand sidebar)
 * @since 3.2.1
 */
function instant_img_media_upload_tabs_handler($tabs) {
	$show_media_tab = InstantImages::instant_img_show_tab('media_modal_display');
	if($show_media_tab){
		$newtab = array ( 'instant_img_tab' => __('Instant Images', 'instant-images') );
	   $tabs = array_merge( $tabs, $newtab );
		return $tabs;
	}
}
add_filter('media_upload_tabs', 'instant_img_media_upload_tabs_handler');


/**
 * Add Instant Images media button to classic editor screens
 * @since 3.2.1
 */
function instant_img_media_buttons() {
	$show_button = InstantImages::instant_img_show_tab('media_modal_display');
	if($show_button){
		echo '<a href="'.add_query_arg('tab', 'instant_img_tab', esc_url(get_upload_iframe_src())).'" class="thickbox button" title="'.esc_attr__('Instant Images', 'instant-images').'">&nbsp;'. __('Instant Images', 'instant-images') .'&nbsp;</a>';
	}
}
add_filter('media_buttons', 'instant_img_media_buttons');


/**
 * Add instant images iframe to classic editor screens
 * @since 3.2.1
*/
function media_upload_instant_images_handler() {
	wp_iframe('media_instant_img_tab');
}
add_action('media_upload_instant_img_tab', 'media_upload_instant_images_handler');


/**
 * Add pop up content to edit, new and post pages on classic editor screens
 * @since 2.0
 */
function media_instant_img_tab() {
   instant_img_scripts();
   $show_settings = false;
   ?>
   <div class="instant-img-container editor" data-media-popup="true">
      <?php include( INSTANT_IMG_PATH . 'admin/views/unsplash.php'); ?>
   </div>
<?php
}

/**
 * Filter the WP Admin footer text
 * @since 2.0
 */
function instant_img_filter_admin_footer_text( $text ) {
	$screen = get_current_screen();
	$base = 'media_page_'.INSTANT_IMG_NAME;
	if($screen->base === $base){
	   echo INSTANT_IMG_TITLE .' '.'is made with <span style="color: #e25555;">♥</span> by <a href="https://connekthq.com/?utm_source=WPAdmin&utm_medium=InstantImages&utm_campaign=Footer" target="_blank" style="font-weight: 500;">Connekt</a> | <a href="https://wordpress.org/support/plugin/instant-images/reviews/#new-post" target="_blank" style="font-weight: 500;">Leave a Review</a> | <a href="https://connekthq.com/plugins/instant-images/faqs/" target="_blank" style="font-weight: 500;">FAQs</a>';
	}
}
add_filter( 'admin_footer_text', 'instant_img_filter_admin_footer_text'); // Admin menu text
