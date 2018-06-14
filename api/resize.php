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
   
	if (is_user_logged_in() && current_user_can( apply_filters('instant_images_user_role', 'edit_theme_options') )){
   	   	
		error_reporting(E_ALL|E_STRICT);
		
		require_once( ABSPATH . 'wp-admin/includes/file.php' ); // download_url()
		require_once( ABSPATH . 'wp-admin/includes/image.php' ); // wp_read_image_metadata()	
		
		
		// WP Options
		$options = get_option( 'instant_img_settings' );
      $download_w = isset($options['unsplash_download_w']) ? $options['unsplash_download_w'] : 1600; // width
      $download_h = isset($options['unsplash_download_h']) ? $options['unsplash_download_h'] : 1200; // height
			
            
      // Get JSON Data
      $data = json_decode($request->get_body()); // Get contents of request     
      $path = sanitize_text_field($data->path); // Path on server
      $name = sanitize_text_field($data->filename); // name
      $filename = $path . $name; // full filename
      $filetype = wp_check_filetype( basename( $filename ), null );
      $desc = sanitize_text_field($data->desc); // Image description
      $url = sanitize_text_field($data->url); // Image URL    


		// Resize image to max size (set in Settings)
      $image = wp_get_image_editor( $filename );
      if ( ! is_wp_error( $image ) ) {
         $image->resize( $download_w, $download_h, false );
         $image->save( $filename );
      }
      

		// Get upload directory
      $wp_upload_dir = wp_upload_dir(); // ['path'] ['basedir']
      
      
      // Copy file from uploads/instant-images to a media library directory.
      $new_filename = $wp_upload_dir['path'] .'/'. $name;
      $copy_file = copy($filename , $new_filename);
      
      if(!$copy_file){
	      
	      // Error         
         $response = array( 
      		'success' => false,
      		'msg' => __('Unable to copy image to the media library. Please check your server permissions.', 'instant-images')
   		);
	      
      } else {     
      
      
	      // Build attachment array
	      $attachment = array(
		     'guid'=> $wp_upload_dir['url'] . basename( $new_filename ), 
		     'post_mime_type' => $filetype['type'],
		     'post_title' => $desc,
		     'post_content' => '',
		     'post_status' => 'inherit'
	      );
	            
	      
	      $image_id = wp_insert_attachment($attachment, $new_filename, 0); // Insert as attachment
	      $attach_data = wp_generate_attachment_metadata( $image_id, $new_filename ); // Generate metadata
	      wp_update_attachment_metadata( $image_id, $attach_data ); // Add metadata
	          
	      
	      // Response   
	      if(file_exists($new_filename)){ // If image was uploaded temporary image
	         
	         // Success
	         $response = array(
	      		'success' => true,
	      		'msg' => __('Image successfully uploaded to your media library!', 'instant-images')
	   		);
	   		
	      }else{ 
		      
		      // Error         
	         $response = array( 
	      		'success' => false,
	      		'msg' => __('There was an error sending the image to your media library. Please check your server permissions and confirm the upload_max_filesize setting (php.ini) is large enough for the downloaded image.', 'instant-images')
	   		);
	   		
	      }
      }
      
      
      // Delete temporary image
      if(file_exists($filename)){      
         unlink($filename);
      }
      

      // Send response as JSON
      wp_send_json($response);
		
   }

}
