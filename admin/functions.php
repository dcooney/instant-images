<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly



/*
*  instant_img_get_app_id
*  Get the current app id from settings
*
*  @since 2.0
*/   
function instant_img_get_app_id(){
   $options = get_option( 'instant_img_settings' );
   $app_id = isset($options['unsplash_app_id']) ? $options['unsplash_app_id'] : INSTANT_IMG_DEFAULT_APP_ID;      
   if(empty($app_id)){
      $app_id = INSTANT_IMG_DEFAULT_APP_ID;
   }
   return $app_id;   
}