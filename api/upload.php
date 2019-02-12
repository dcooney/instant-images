<?php

/*
*  rest_api_init
*  Custom /upload route
*
*  @since 3.0
*/

add_action( 'rest_api_init', function () {
   $my_namespace = 'instant-images';
   $my_endpoint = '/upload';
   register_rest_route( $my_namespace, $my_endpoint, 
      array(
         'methods' => 'POST',
         'callback' => 'instant_images_upload_image',
      )
   );
});



/*
*  upload_image
*  Upload Image to /uploads directory
*
*  @param $request      $_POST
*  @return $response    json
*  @since 3.0
*  @updated 3.3
*/

function instant_images_upload_image( WP_REST_Request $request ) {  	
   
	if (is_user_logged_in() && current_user_can( apply_filters('instant_images_user_role', 'edit_theme_options') )){ 
   	 	
   	error_reporting(E_ALL|E_STRICT);   	
   	
   	// Create /instant-images directory inside /uploads to temporarily store images
      if(!is_dir(INSTANT_IMG_UPLOAD_PATH)){
   		wp_mkdir_p(INSTANT_IMG_UPLOAD_PATH);
      }
   
      // Is directory writeable, if not exit with an error
      if (!is_writable(INSTANT_IMG_UPLOAD_PATH.'/')) {
         $response = json_encode(
         	array(
         		'error' => true,
         		'msg' => __('Unable to save image, check your server permissions of `uploads/instant-instants`', 'instant-images')
      		)
         );
      	wp_send_json($response);
      }   	 
         	
      $body = json_decode($request->get_body(), true); // Get contents of request       
      $data = json_decode($body['data']); // Info about image
      $path = INSTANT_IMG_UPLOAD_PATH.'/'; // Temp Image Path
      
      
      // Get data params from the $body
      if($data){
         $id = sanitize_key($data->id); // Image ID
         $img = sanitize_text_field($data->image); // Image URL
      }
      
      
      // If ID and IMG not set, exit
      if(!isset($id) || !isset($img)){
	      $response = array(
      		'error' => true,
      		'msg' => __('An issue occurred retrieving image info via the REST API.', 'instant-images'),
      		'path' => $path,
      		'filename' => $filename
   		);
   		wp_send_json($response);
      }
      
      
      // Create temp. image variables
      $filename = $id.'.jpg';
      $img_path = $path .''.$filename;
      
      
      if(function_exists('copy')){
	          
         // Save file to server using copy() function
         $saved_file = @copy($img.'jpg', $img_path);
   
         // Was the temporary image saved?
         if ($saved_file) {
   
            if(file_exists($path.''.$filename)){
               
               //  SUCCESS - Image saved
               $response = array(
            		'error' => false,
            		'msg' => __('Image successfully uploaded to server.', 'instant-images'),
            		'path' => $path,
            		'filename' => $filename
         		);
         		
            }else{
               
               // ERROR - File does NOT exist
               $response = array(
            		'error' => true,
            		'msg' => __('Uploaded image not found, please ensure you have proper permissions set on the uploads directory.', 'instant-images'),
            		'path' => '',
                  'filename' => ''
         		);
         		
            }
   
         } else {
   
            // ERROR - Error on save
            $response = array(
         		'error' => true,
         		'msg' => __('Unable to download image to server, please check the server permissions of the instant-images folder in your WP uploads directory.', 'instant-images'),
         		'path' => '',
               'filename' => ''
      		);
   
         }
         
      }
      
      // copy() not enabled
      else{
         
         $response = array(
      		'error' => true,
      		'msg' => __('The core PHP copy() function is not available on your server. Please contact your server administrator to upgrade your PHP version.', 'instant-images'),
      		'path' => $path,
      		'filename' => $filename
   		);
   		
      }
      
      wp_send_json($response);      
		
   }

}
