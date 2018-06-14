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
         'callback' => 'upload_image',
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

*/

function upload_image( WP_REST_Request $request ) {
   
	if (is_user_logged_in() && current_user_can( apply_filters('instant_images_user_role', 'edit_theme_options') )){   	
		error_reporting(E_ALL|E_STRICT);   	
   	
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
   	   	
   	
      $data = json_decode($request->get_body()); // Get contents of request     
      $id = sanitize_key($data->id); // Image ID
      $img = sanitize_text_field($data->image); // Image URL
      $desc = sanitize_text_field($data->desc); // Image Description
      
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
            $response = array(
         		'error' => false,
         		'msg' => __('Image successfully uploaded to server.', 'instant-images'),
         		'path' => $path,
         		'filename' => $filename,
         		'desc' => $desc,
         		'url' => $url,
      		);
      		
         }else{
            
            // File does NOT exist
            $response = array(
         		'error' => true,
         		'msg' => __('Uploaded image not found, please ensure you have proper permissions set on the uploads directory.', 'instant-images')
      		);
      		
         }

      } else {

         // Error on save
         $response = array(
      		'error' => true,
      		'msg' => __('Unable to download image to server, please check your server permissions.', 'instant-images')
   		);

      }
      
      wp_send_json($response);      
		
   }

}
