<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly


/**
* instant_img_admin_menu
* Create Admin Menu
*
* @since 2.0
*/

function instant_img_admin_menu() {
   $usplash_settings_page = add_submenu_page( 
   	'upload.php', 
   	INSTANT_IMG_TITLE, 
   	INSTANT_IMG_TITLE, 
   	apply_filters('instant_images_user_role', 'edit_theme_options'), 
   	INSTANT_IMG_NAME, 
   	'instant_img_settings_page'
   );
   add_action( 'load-' . $usplash_settings_page, 'instant_img_load_scripts' ); //Add our admin scripts
}
add_action( 'admin_menu', 'instant_img_admin_menu' );




/**
* instant_img_load_scripts
* Load Admin CSS and JS
*
* @since 1.0
*/

function instant_img_load_scripts(){
	add_action( 'admin_enqueue_scripts', 'instant_img_enqueue_scripts' );
}




/**
* instant_img_enqueue_scripts
* Admin Enqueue Scripts
*
* @since 2.0
*/

function instant_img_enqueue_scripts(){
	instant_img_scripts();
}




/**
* instant_img_scripts
* Localize vars and scripts
*
* @since 3.0
*/
function instant_img_scripts(){
	wp_enqueue_style('admin-instant-images', INSTANT_IMG_URL. 'dist/css/instant-images.css', '', INSTANT_IMG_VERSION);
   wp_enqueue_script('jquery');
   wp_enqueue_script('jquery-form', true);
   wp_enqueue_script('masonry', true);
   
   wp_enqueue_script('instant-images-react', INSTANT_IMG_URL. 'dist/js/instant-images.js', '', INSTANT_IMG_VERSION, true);
   wp_enqueue_script('instant-images', INSTANT_IMG_ADMIN_URL. 'assets/js/admin.js', 'jquery', INSTANT_IMG_VERSION, true);
   
   $options = get_option( 'instant_img_settings' );
   $download_w = isset($options['unsplash_download_w']) ? $options['unsplash_download_w'] : 1600; // width of download file
   $download_h = isset($options['unsplash_download_h']) ? $options['unsplash_download_h'] : 1200; // height of downloads
   
	wp_localize_script( 
		'instant-images-react', 'instant_img_localize', array(
			'root' => esc_url_raw( rest_url() ), 
			'nonce' => wp_create_nonce( 'wp_rest' ),
			'ajax_url' => admin_url('admin-ajax.php'),
			'admin_nonce' => wp_create_nonce('instant_img_nonce'),
			'download_width' => $download_w,
			'download_height' => $download_h,
			'unsplash_default_app_id' => INSTANT_IMG_DEFAULT_APP_ID,
			'unsplash_app_id' => INSTANT_IMG_DEFAULT_APP_ID,
			'error_msg_title' => __('Error accessing Unsplash API', 'instant-images'),
			'error_msg_desc' => __('Please check your Application ID.', 'instant-images'),
			'error_upload' => __('Unable to download image to server, please check your server permissions.', 'instant-images'),
			'error_resize' => __('There was an error sending the image to your media library. Please check your server permissions and confirm the upload_max_filesize setting (php.ini) is large enough for the downloaded image.', 'instant-images'),
			'photo_by' => __('Photo by', 'instant-images'),
			'view_all' => __('View all photos by', 'instant-images'),
			'upload' => __('Click Image to Upload', 'instant-images'),
			'full_size' => __('View Full Size', 'instant-images'),
			'likes' => __('Like(s)', 'instant-images'),
			'saving' => __('Downloading Image...', 'instant-images'),
			'resizing' => __('Resizing Image...', 'instant-images'),
			'no_results' => __('Sorry, nothing matched your query', 'instant-images'),
			'no_results_desc' => __('Please try adjusting your search criteria', 'instant-images'),
			'latest' => __('New', 'instant-images'),
			'oldest' => __('Oldest', 'instant-images'),
			'popular' => __('Popular', 'instant-images'),
			'load_more' => __('Load More Images', 'instant-images'),
			'search' => __('Search for Toronto, Coffee + Breakfast etc...', 'instant-images'),
			'search_results' => __('images found for', 'instant-images'),
			'clear_search' => __('Clear search results', 'instant-images')
		)
	);
}



/**
* instant_img_media_popup
* Add pop up button to post/page editor
*
* @since 2.0
*/

function instant_img_media_popup() {   
   
   $title_txt = INSTANT_IMG_TITLE; // popup title
   $context = "<a href='#TB_inline?width=1000&height=600&inlineId=instant_images_modal' class='button thickbox instant-images' title='$title_txt'>&nbsp;".$title_txt."&nbsp;</a>";   
   echo $context;

}
add_action( 'media_buttons',  'instant_img_media_popup', 15 );




/**
* instant_img_media_popup_content
* Add pop up content to edit, new and post pages
*
* @since 2.0
*/

function instant_img_media_popup_content() {
   instant_img_scripts();
   ?>
   <div id="instant_images_modal" style="display:none;">	   
   <style>
	  .instant-img-container li:before{
		   display: none !important;
	   }
	</style>
      <div class="instant-img-container popup">
         <?php include( INSTANT_IMG_PATH . 'admin/views/unsplash.php'); ?>         
         <div class="initialize-wrap"> 
         	<button type="button" class="button init-btn button-large"><i class="fa fa-bolt" aria-hidden="true"></i> <?php _e('Initialize Instant Images', 'instant-images'); ?></button>
         </div>
      </div>
   </div>
<?php
}
add_action( 'admin_head-post.php',  'instant_img_media_popup_content' );
add_action( 'admin_head-post-new.php',  'instant_img_media_popup_content' );
add_action( 'admin_head-edit.php',  'instant_img_media_popup_content' );




/*
*  instant_img_settings_page
*  Settings page
*
*  @since 2.0
*/

function instant_img_settings_page(){
   echo '<div class="instant-img-container">';
      include( INSTANT_IMG_PATH . 'admin/views/unsplash.php');
   echo '</div>';
}



/*
*  instant_img_filter_admin_footer_text
*  Filter the WP Admin footer text
*
*  @since 2.0
*/

function instant_img_filter_admin_footer_text( $text ) {
	$screen = get_current_screen();
	$base = 'media_page_'.INSTANT_IMG_NAME;
	if($screen->base === $base){
	   echo INSTANT_IMG_TITLE .' '.'is made with <span style="color: #e25555;">♥</span> by <a href="https://connekthq.com/?utm_source=WPAdmin&utm_medium=InstantImages&utm_campaign=Footer" target="_blank" style="font-weight: 500;">Connekt</a> - <a href="https://connekthq.com/plugins/instant-images/" target="_blank">Get Support</a>';
	}
}
add_filter( 'admin_footer_text', 'instant_img_filter_admin_footer_text'); // Admin menu text


