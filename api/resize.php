<?php

/*
*  rest_api_init
*  Custom /resize route
*
*  @since 3.0
*/

add_action( 'rest_api_init', function () {
   $my_namespace = 'instant-images';
   $my_endpoint = '/resize';
   register_rest_route( $my_namespace, $my_endpoint, 
      array(
         'methods' => 'POST',
         'callback' => 'resize_image',
      )
   );
});



/*
*  resize_image
*  Resize Image and run thru media uploader
*
*  @param $request      $_POST
*  @return $response    json
*  @since 3.0

*/

function resize_image( WP_REST_Request $request ) {
   
	if (is_user_logged_in() && current_user_can( 'edit_theme_options' )){
   	   	
		error_reporting(E_ALL|E_STRICT);
		
		require_once( ABSPATH . 'wp-admin/includes/media.php' ); // media_sideload_image()
		require_once( ABSPATH . 'wp-admin/includes/file.php' ); // download_url() 
		require_once( ABSPATH . 'wp-admin/includes/image.php' ); // wp_read_image_metadata()
		
		
		
		// WP Options
		$options = get_option( 'instant_img_settings' );
      $download_w = isset($options['unsplash_download_w']) ? $options['unsplash_download_w'] : 1600; // width
      $download_h = isset($options['unsplash_download_h']) ? $options['unsplash_download_h'] : 1200; // height

      
      // JSON Post Data
      $data = json_decode($request->get_body()); // Get contents of request     
      $path = sanitize_text_field($data->path); // Path on server
      $filename = sanitize_text_field($data->filename); // filename
      $desc = sanitize_text_field($data->desc); // Image description
      $url = sanitize_text_field($data->url); // Image URL      
            
      // Resize image
      $image = wp_get_image_editor( $path.''.$filename );
      if ( ! is_wp_error( $image ) ) {
         $image->resize( $download_w, $download_h, false );
         $image->save($path.''.$filename);
      }

      // Send to media library
      $file = media_sideload_image($url.''.$filename, 0, $desc);
      
      
      // WP_ERROR
      if ( is_wp_error( $file ) ) {
         $error_string = $file->get_error_message();
                  
         // Build error response
         $response = array(
      		'success' => false,
      		'msg' => $error_string .' - '. __('There was an error sending image to your media library. Are you using password protection on the domain? If so, please read the Instant Images FAQ for instructions on how to fix this issue.', 'instant-images')
   		);
         
         
      } else {      
      
         
         if(file_exists($path.''.$filename)){ // If image was uploaded temporary image
            
            // Build success response
            $response = array(
         		'success' => true,
         		'msg' => __('Image successfully uploaded to your media library!', 'instant-images')
      		);
      		
         }else{ // Build error response            
            
            $response = array( 
         		'success' => false,
         		'msg' => __('There was an error sending the image to your media library. Please check your server permissions and confirm the upload_max_filesize setting (php.ini) is large enough for the downloaded image.', 'instant-images')
      		);
      		
         }
      }
      
      
      // Delete temporary image
      if(file_exists($path.''.$filename)){      
         unlink($path.''.$filename);
      }
      

      // Send JSON response
      wp_send_json($response);
		
   }

}
