<?php
/*
Plugin Name: Instant Images
Plugin URI: https://connekthq.com/plugins/instant-images/
Description: One click photo uploads directly to your media library.
Author: Darren Cooney
Twitter: @connekthq
Author URI: https://connekthq.com
Text Domain: instant-images
Version: 4.0.1
License: GPL
Copyright: Darren Cooney & Connekt Media
*/

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly


define('INSTANT_IMAGES_VERSION', '4.0.1');
define('INSTANT_IMAGES_RELEASE', 'April 18, 2019');


/*
	*  instant_images_activate
	*  Activation hook
	*
	*  @since 2.0
	*/
function instant_images_activate() {
   // Create /instant-images directory inside /uploads to temporarily store images
   $upload_dir = wp_upload_dir();
   $dir = $upload_dir['basedir'].'/instant-images';
   if(!is_dir($dir)){
      wp_mkdir_p($dir);
   }
}
register_activation_hook( __FILE__, 'instant_images_activate' );



/*
	*  instant_images_deactivate
	*  De-activation hook
	*
	*  @since 3.2.2
	*/
function instant_images_deactivate() {
   // Delete /instant-images directory inside /uploads to temporarily store images
   $upload_dir = wp_upload_dir();
   $dir = $upload_dir['basedir'].'/instant-images';
   if(is_dir($dir)){
      // Check for files in dir
      foreach (glob($dir."/*.*") as $filename) {
         if (is_file($filename)) {
            unlink($filename);
         }
      }
      // Delete the directory
      rmdir($dir);
   }
}
register_deactivation_hook( __FILE__, 'instant_images_deactivate' );



class InstantImages {

   function __construct() {
		add_filter( 'plugin_action_links_' . plugin_basename(__FILE__), array(&$this, 'instant_images_add_action_links') );
		add_action( 'enqueue_block_editor_assets', array(&$this, 'instant_img_block_enqueue') ); // Blocks		
		load_plugin_textdomain( 'instant-images', false, dirname( plugin_basename( __FILE__ ) ) . '/lang/' ); // load text domain
		
      $this->includes();
      $this->constants();
	}
	
	
	
   /**
    * instant_img__block_enqueue
    * Enqueue script for Gutenberg Blocks
    *
	 *  @since 4.0
    */
   function instant_img_block_enqueue() {      
      $suffix = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min'; // Use minified libraries if SCRIPT_DEBUG is turned off
   	wp_enqueue_script('instant-images-block', INSTANT_IMG_URL. 'dist/js/instant-images-block'. $suffix .'.js', '', INSTANT_IMG_VERSION, true);
      wp_enqueue_style('admin-instant-images', INSTANT_IMG_URL. 'dist/css/instant-images'. $suffix .'.css', '', INSTANT_IMG_VERSION);
      InstantImages::instant_img_localize( 'instant-images-block' );
   }



   /**
    * instant_img_localize
    * Localization strings
    *
	 *  @since 2.0
    */
   public static function instant_img_localize($script = 'instant-images-react'){

      $options = get_option( 'instant_img_settings' );
      $download_w = isset($options['unsplash_download_w']) ? $options['unsplash_download_w'] : 1600; // width of download file
      $download_h = isset($options['unsplash_download_h']) ? $options['unsplash_download_h'] : 1200; // height of downloads

      wp_localize_script(
   		$script, 'instant_img_localize', array(
   			'instant_images' => __('Instant Images', 'instant-images'),
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
   			'error_restapi' => __('There was an error accessing the WP REST API - Instant Images requires access to the WP REST API to fetch and upload images to your media library.', 'instant-images'),
   			'photo_by' => __('Photo by', 'instant-images'),
   			'view_all' => __('View All Photos by', 'instant-images'),
   			'upload' => __('Click Image to Upload', 'instant-images'),
   			'upload_btn' => __('Click to Upload', 'instant-images'),
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
   			'clear_search' => __('Clear Search Results', 'instant-images'),
   			'view_on_unsplash' => __('View Photo on Unsplash', 'instant-images'),
   			'set_as_featured' => __('Set as Featured Image', 'instant-images'),
   			'insert_into_post' => __('Insert Into Post', 'instant-images'),
   			'edit_filename' => __('Filename', 'instant-images'),
   			'edit_alt' => __('Alt Text', 'instant-images'),
   			'edit_caption' => __('Caption', 'instant-images'),
   			'edit_details' => __('Edit Image Details', 'instant-images'),
   			'edit_details_intro' => __('Update and save image details prior to uploading', 'instant-images'),
   			'cancel' => __('Cancel', 'instant-images'),
   			'save' => __('Save', 'instant-images')
   		)
   	);
   }



	/**
	 *  includes
	 *  Include these files in the admin
	 *
	 *  @since 2.0
	 */
	private function includes(){
		if( is_admin()){
			include_once('admin/admin.php');
			include_once('admin/includes/settings.php');
			include_once('vendor/connekt-plugin-installer/class-connekt-plugin-installer.php');
		}
		// REST API Routes
		include_once('api/resize.php');
		include_once('api/test.php');
		include_once('api/upload.php');
   }



	/*
	*  constants
	*  Include these files in the admin
	*
	*  @since 2.0
	*/

	private function constants(){
		define('INSTANT_IMG_VERSION', '3.3.0');
		define('INSTANT_IMG_RELEASE', 'January 10, 2019');
		define('INSTANT_IMG_TITLE', 'Instant Images');
		$upload_dir = wp_upload_dir();
		define('INSTANT_IMG_UPLOAD_PATH', $upload_dir['basedir'].'/instant-images');
		define('INSTANT_IMG_UPLOAD_URL', $upload_dir['baseurl'].'/instant-images/');
		define('INSTANT_IMG_PATH', plugin_dir_path(__FILE__));
		define('INSTANT_IMG_URL', plugins_url( '/', __FILE__));
		define('INSTANT_IMG_ADMIN_URL', plugins_url('admin/', __FILE__));
		define('INSTANT_IMG_WPADMIN_URL', admin_url( 'upload.php?page=instant-images' ));
		define('INSTANT_IMG_NAME', 'instant-images');
		define('INSTANT_IMG_DEFAULT_APP_ID', '5746b12f75e91c251bddf6f83bd2ad0d658122676e9bd2444e110951f9a04af8');
   }



   /*
	*  instant_images_add_action_links
	*  Add custom links to plugins.php
	*
	*  @since 2.0
	*/
   function instant_images_add_action_links ( $links ) {
      $mylinks = array(
         '<a href="' . INSTANT_IMG_WPADMIN_URL . '">Upload Photos</a>',
      );
      return array_merge( $mylinks, $links );
   }

}



/*
*  InstantImages
*  The main function responsible for returning the one true InstantImages Instance.
*
*  @since 2.0
*/

function InstantImages(){
	global $InstantImages;
	if( !isset($InstantImages)){
		$InstantImages = new InstantImages();
	}
	return $InstantImages;
}
// initialize
InstantImages();
