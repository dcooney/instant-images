<?php
/*
Plugin Name: Instant Images
Plugin URI: https://connekthq.com/plugins/instant-images/
Description: One click uploads of unsplash.com photos directly to your media library (formally UnsplashWP)
Author: Darren Cooney
Twitter: @connekthq
Author URI: https://connekthq.com
Version: 2.0
License: GPL
Copyright: Darren Cooney & Connekt Media
*/

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly


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
      mkdir($dir);
   }
}
register_activation_hook( __FILE__, 'instant_images_activate' );



class InstantImages {	
   
   function __construct() {  
		add_filter( 'plugin_action_links_' . plugin_basename(__FILE__), array(&$this, 'instant_images_add_action_links') );
		load_plugin_textdomain( 'instant-images', false, dirname( plugin_basename( __FILE__ ) ) . '/lang/' ); // load text domain		
      $this->includes();	
      $this->constants();	
	}
	
	
	
	/*
	*  includes
	*  Include these files in the admin
	*
	*  @since 2.0
	*/
	
	private function includes(){
		if( is_admin()){
			include_once('admin/admin.php');
			include_once('admin/functions.php');
			include_once('admin/includes/settings.php');
		}		
   } 
	
	
	
	/*
	*  constants
	*  Include these files in the admin
	*
	*  @since 2.0
	*/
	
	private function constants(){		
      define('INSTANT_IMG_VERSION', '2.0');
      define('INSTANT_IMG_RELEASE', 'November 1, 2016');
      define('INSTANT_IMG_TITLE', 'Instant Images');
      $upload_dir = wp_upload_dir();
      define('INSTANT_IMG_UPLOAD_PATH', $upload_dir['basedir'].'/instant-images');
      define('INSTANT_IMG_UPLOAD_URL', $upload_dir['baseurl'].'/instant-images/');
      define('INSTANT_IMG_PATH', plugin_dir_path(__FILE__));
		define('INSTANT_IMG_ADMIN_URL', plugins_url('admin/', __FILE__));  
		define('INSTANT_IMG_WPADMIN_URL', admin_url( 'upload.php?page=instant-images' ));
		define('INSTANT_IMG_HELP_URL', 'https://connekthq.com/plugins/instant-images/api-access/');
		define('INSTANT_IMG_NAME', 'instant-images');	
		define('INSTANT_IMG_DEFAULT_APP_ID', '5746b12f75e91c251bddf6f83bd2ad0d658122676e9bd2444e110951f9a04af8');
		define('INSTANT_IMG_WARNING', '100');	
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

