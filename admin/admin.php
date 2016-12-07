<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
   
/*
*  instant_img_admin_vars
*  Create admin variables and ajax nonce
*
*  @since 2.0
*/

function instant_img_admin_vars() { 
	$options = get_option( 'instant_img_settings' );   
   $download_w = isset($options['unsplash_download_w']) ? $options['unsplash_download_w'] : 1600; // width of download file
   $download_h = isset($options['unsplash_download_h']) ? $options['unsplash_download_h'] : 1200; // height of downloads     
   $app_id = instant_img_get_app_id(); // APPLICATION ID   
?>
    <script type='text/javascript'>
	 /* <![CDATA[ */
    var instant_img_localize = <?php echo json_encode( array( 
        'ajax_url' => admin_url('admin-ajax.php'),
        'admin_nonce' => wp_create_nonce('instant_img_nonce'),
		  'download_width' => $download_w,
		  'download_height' => $download_h,
		  'unsplash_default_app_id' => INSTANT_IMG_DEFAULT_APP_ID,
		  'unsplash_app_id' => $app_id,
		  'error_msg_title' => __('Error accessing Unsplash API', 'instant-images'),
		  'error_msg_desc' => __('Please check your Application ID.', 'instant-images'),
		  'error_upload' => __('Unable to save image, please check your server permissions.', 'instant-images'),
		  'photo_by' => __('Photo by', 'instant-images'),
		  'view_all' => __('View all photos by', 'instant-images'),
		  'upload' => __('click to upload', 'instant-images'),
		  'full_size' => __('View Full Size', 'instant-images'),
		  'likes' => __('Like(s)', 'instant-images'),
		  'saving' => __('Downloading photo', 'instant-images'),
		  'resizing' => __('Resizing photo', 'instant-images'),
		  'no_results' => __('Sorry, nothing matched your query', 'instant-images'),
		  'no_results_desc' => __('Please try adjusting your search criteria', 'instant-images')
    )); ?>
    /* ]]> */
    </script>
<?php }
add_action( 'admin_head', 'instant_img_admin_vars' );




/**
* instant_img_admin_menu
* Create Admin Menu
*
* @since 2.0
*/

function instant_img_admin_menu() {  
   $usplash_settings_page = add_submenu_page( 'upload.php', INSTANT_IMG_TITLE, INSTANT_IMG_TITLE, 'edit_theme_options', INSTANT_IMG_NAME, 'instant_img_settings_page'); 	   
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
   wp_enqueue_style('admin-instant-image', INSTANT_IMG_ADMIN_URL. 'assets/css/admin.css');
   wp_enqueue_style('font-awesome-instant-image', INSTANT_IMG_ADMIN_URL. 'assets/css/font-awesome.min.css');
   wp_enqueue_script('jquery');
   wp_enqueue_script('jquery-form');
   wp_enqueue_script('jquery-masonry');   
   wp_enqueue_script('imagesLoaded', INSTANT_IMG_ADMIN_URL. 'assets/js/libs/imagesloaded.pkgd.min.js', 'jquery');
   wp_enqueue_script('unsplash-helpers', INSTANT_IMG_ADMIN_URL. 'assets/js/helpers.unsplash.js', array( 'jquery' ));
   wp_enqueue_script('unsplash', INSTANT_IMG_ADMIN_URL. 'assets/js/unsplash.js', array( 'unsplash-helpers' ));
   wp_enqueue_script('instant-images', INSTANT_IMG_ADMIN_URL. 'assets/js/admin.js', 'jquery');
}




/**
* instant_img_media_popup
* Add pop up button to post/page editor
*
* @since 2.0
*/

function instant_img_media_popup($context) {

  // popup title
  $title = INSTANT_IMG_TITLE;
  $title_txt = INSTANT_IMG_TITLE .' - '. __('Direct image upload to your media library', 'instant-images');
  $context .= "<a href='#TB_inline?width=600&height=600&inlineId=instant_images_modal'
    class='button thickbox instant-images' title='$title_txt'>
    <span class='dashicons dashicons-format-gallery' style='font-size: 16px; top: 6px;'></span> ".INSTANT_IMG_TITLE."</a>";

  return $context;
  
}
add_action( 'media_buttons_context',  'instant_img_media_popup' );




/**
* instant_img_media_popup_content
* Add pop up content to edit, new and post pages
*
* @since 2.0
*/

function instant_img_media_popup_content() {
   wp_enqueue_style( 'admin-css', INSTANT_IMG_ADMIN_URL. 'assets/css/admin.css');
   wp_enqueue_style( 'font-awesome', INSTANT_IMG_ADMIN_URL. 'assets/css/font-awesome.min.css');
   wp_enqueue_script('jquery');
   wp_enqueue_script('jquery-form');
   wp_enqueue_script('jquery-masonry');   
   wp_enqueue_script('imagesLoaded', INSTANT_IMG_ADMIN_URL. 'assets/js/libs/imagesloaded.pkgd.min.js', 'jquery');
   wp_enqueue_script('unsplash-helpers', INSTANT_IMG_ADMIN_URL. 'assets/js/helpers.unsplash.js', array( 'jquery' ));
   wp_enqueue_script('unsplash', INSTANT_IMG_ADMIN_URL. 'assets/js/unsplash.js', array( 'unsplash-helpers' ));
   wp_enqueue_script('instant-images', INSTANT_IMG_ADMIN_URL. 'assets/js/admin.js', 'jquery');
   ?>
   <div id="instant_images_modal" style="display:none;">
      <div class="instant-img-container relax">
         <?php include( INSTANT_IMG_PATH . 'admin/views/unsplash-app.php'); ?>
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
   include( INSTANT_IMG_PATH . 'admin/views/unsplash.php');
}




/*
*  instant_img_unsplash_upload_image
*  Upload Image Ajax Function
*
*  @since 2.0
*/

function instant_img_upload_image(){
   
   if (current_user_can( 'edit_theme_options' )){
      
      error_reporting(E_ALL|E_STRICT);      
      
   	$options = get_option( 'instant_img_settings' );   
      $download_w = isset($options['unsplash_download_w']) ? $options['unsplash_download_w'] : 1600; // width
      $download_h = isset($options['unsplash_download_h']) ? $options['unsplash_download_h'] : 1200; // height     
      
   	$nonce = sanitize_key($_POST["nonce"]);
   	if (! wp_verify_nonce( $nonce, 'instant_img_nonce' ))
   		die('Unable to verify WP nonce');   
   	
      // Create /instant-images directory inside /uploads to temporarily store images
      $dir = INSTANT_IMG_UPLOAD_PATH;
      if(!is_dir($dir)){
        mkdir($dir);
      }
      
      // Is directory writeable, if not exit with an error
      if (!is_writable(INSTANT_IMG_UPLOAD_PATH.'/')) {
         $json = json_encode( 
         	array(
         		'error' => true,
         		'msg' => __('Unable to save image, check your server permissions', 'instant-images')
      		)
         );    	
      	echo $json;   	
      	die();
      }
      
   	// Get image variables
   	$id = sanitize_key($_POST["id"]); // Image ID
   	$img = sanitize_text_field($_POST["image"]); // Image URL
   	$desc = sanitize_text_field($_POST["description"]); // Image Description
   	$path = INSTANT_IMG_UPLOAD_PATH.'/'; // Temp Image Path
   	$url = INSTANT_IMG_UPLOAD_URL; // Full url path for image upload
   	
   	// Create temp. image variable
      $filename = $id.'.jpg';
      $tmp_img = $path .''.$filename;  
      
      // Generate temp image from URL and store it on server for upload
      $ch = curl_init(); // Lets use cURL
      curl_setopt($ch, CURLOPT_URL, $img);
      curl_setopt($ch, CURLOPT_HEADER, 0);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
      curl_setopt($ch, CURLOPT_BINARYTRANSFER,1);
      $picture = curl_exec($ch);
      curl_close($ch);
      
      // Save file to server
      $saved_file = file_put_contents($tmp_img, $picture);        
      
       // Was the temporary image saved?
       
      if ($saved_file) { 
                        
         if(file_exists($path.''.$filename)){
            //  Successfully saved
            $json = json_encode( 
            	array(
            		'error' => false,
            		'msg' => __('Image successfully saved to server.', 'instant-images'),
            		'path' => $path,
            		'filename' => $filename,
            		'desc' => $desc,
            		'url' => $url,
         		)
            );
         }else{
            // File does NOT exist
            $json = json_encode( 
            	array(
            		'error' => true,
            		'msg' => __('Saved file not found, ensure you have proper permissions set on the uploads directory.', 'instant-images')
         		)
            );
         } 
                          
      } else {
         
         // Error on save
         $json = json_encode( 
         	array(
         		'error' => true,
         		'msg' => __('Unable to save image to uploads directory, check your server permissions.', 'instant-images')
      		)
         ); 
                 
      }
   	
   	echo $json;   	
   	die();
   }
}
add_action( 'wp_ajax_instant_img_upload_image', 'instant_img_upload_image' ); // Ajax Upload Image





/*
*  instant_img_resize_image
*  Resize and Upload Image to Media Library
*
*  @since 2.0
*/

function instant_img_resize_image($path, $filename, $desc, $url){
   
   if (current_user_can( 'edit_theme_options' )){
      
      $nonce = sanitize_key($_POST["nonce"]);
   	if (! wp_verify_nonce( $nonce, 'instant_img_nonce' ))
   		die('Unable to verify WP nonce'); 
      
      $path = sanitize_text_field($_POST["path"]);
      $filename = sanitize_text_field($_POST["filename"]);
      $desc = sanitize_text_field($_POST["desc"]);
      $url = sanitize_text_field($_POST["url"]);
      
      // Get size options
   	$options = get_option( 'instant_img_settings' );   
      $download_w = isset($options['unsplash_download_w']) ? $options['unsplash_download_w'] : 1600; // width
      $download_h = isset($options['unsplash_download_h']) ? $options['unsplash_download_h'] : 1200; // height 
      
      // Resize image
      $image = wp_get_image_editor( $path.''.$filename );
      if ( ! is_wp_error( $image ) ) {
         $image->resize( $download_w, $download_h, false );
         $image->save($path.''.$filename);
      }
      
      // Send to media library
      $file = media_sideload_image($url.''.$filename, 0, $desc);
      
      // Delete tmp image
      if(file_exists($path.''.$filename)){
         unlink($path.''.$filename);
         // Send response
         $json = json_encode( 
         	array(
         		'error' => false,
         		'msg' => __('Image successfully uploaded to media library!', 'instant-images')
      		)
         ); 
      }else{
         $json = json_encode( 
         	array(
         		'error' => true,
         		'msg' => __('There was an error sending to image to the Media Library, check your server permissions.', 'instant-images')
      		)
         ); 
      }     
      
      echo $json;
      die();
   }
   
}
add_action( 'wp_ajax_instant_img_resize_image', 'instant_img_resize_image' ); // Ajax Resize + Add to Media library



/*
*  instant_img_api_limit
*  Update the API limit counter
*
*  @since 2.0
*/
function instant_img_api_limit() {	
   
   if (current_user_can( 'edit_theme_options' )){
      
   	$nonce = sanitize_key($_POST["nonce"]);
   	// Check our nonce, if they don't match then bounce!
   	if (! wp_verify_nonce( $nonce, 'instant_img_nonce' ))
   		die('Unable to verify WP nonce');   
      
      $current = (int)get_option('unsplash_api_count');
      $current++;
      update_option('unsplash_api_count', $current);
      
      echo $current;   
          
   	die();	
   }
   
}
add_action( 'wp_ajax_instant_img_api_limit', 'instant_img_api_limit' );




/*
*  instant_img_dismiss_warning
*  Dismiss the API warning displayed on the photos page
*
*  @since 2.0
*/
function instant_img_dismiss_warning() {	   
   if (current_user_can( 'edit_theme_options' )){   
              
   	$nonce = sanitize_key($_POST["nonce"]);
   	// Check our nonce, if they don't match then bounce!
   	if (! wp_verify_nonce( $nonce, 'instant_img_nonce' ))
   		die('Unable to verify WP nonce');   
      
      update_option('unsplash_api_warning', 'true');            
      echo 'ok';             
   	die();	
   	   	
   }   
}
add_action( 'wp_ajax_instant_img_dismiss_warning', 'instant_img_dismiss_warning' );




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
	   echo INSTANT_IMG_TITLE .' '.'is made with <span style="color: #e25555;">♥</span> by <a href="https://connekthq.com" target="_blank" style="font-weight: 500;">Connekt</a> - <a href="https://connekthq.com/plugins/instant-images/" target="_blank">Get Support</a>';
	}	
}
add_filter( 'admin_footer_text', 'instant_img_filter_admin_footer_text'); // Admin menu text


