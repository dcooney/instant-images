<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/*
*  instant_img_admin_init
*  Initiate the plugin, create our setting variables.
*
*  @since 2.0
*/

add_action( 'admin_init', 'instant_img_admin_init');
function instant_img_admin_init(){
	register_setting(
		'instant-img-setting-group',
		'instant_img_settings',
		'unsplash_sanitize'
	);

	add_settings_section(
		'unsplash_general_settings',
		__('Unsplash Settings', 'instant-images'),
		'unsplash_general_settings_callback',
		'instant-images'
	);

	// Download Width
	add_settings_field(
		'unsplash_download_w',
		__('Upload Image Width', 'instant-images' ),
		'unsplash_download_w_callback',
		'instant-images',
		'unsplash_general_settings'
	);

	// Download Height
	add_settings_field(
		'unsplash_download_h',
		__('Upload Image Height', 'instant-images' ),
		'unsplash_download_h_callback',
		'instant-images',
		'unsplash_general_settings'
	);
}



/*
*  unsplash_general_settings_callback
*  Some general settings text
*
*  @since 1.0
*/

function unsplash_general_settings_callback() {
    echo '<p class="desc">' . __('Manage your media upload settings', 'instant-images') . '.</p>';
}


/*
*  unsplash_sanitize
*  Sanitize our form fields
*
*  @since 1.0
*/

function unsplash_sanitize( $input ) {
    return $input;
}


/*
*  unsplash_download_w_callback
*  Max File download width
*
*  @since 1.0
*/

function unsplash_download_w_callback(){
	$options = get_option( 'instant_img_settings' );

	if(!isset($options['unsplash_download_w']))
	   $options['unsplash_download_w'] = '1600';

	echo '<label for="instant_img_settings[unsplash_download_w]"><strong>'.__('Max Image Upload Width:', 'instant-images').'</strong></label>';
	echo '<input type="number" id="instant_img_settings[unsplash_download_w]" name="instant_img_settings[unsplash_download_w]" value="'.$options['unsplash_download_w'].'" class="sm" step="20" max="3200" /> ';
}



/*
*  unsplash_download_h_callback
*  Max File download height
*
*  @since 1.0
*/

function unsplash_download_h_callback(){
	$options = get_option( 'instant_img_settings' );

	if(!isset($options['unsplash_download_h']))
	   $options['unsplash_download_h'] = '1200';

	echo '<label for="instant_img_settings[unsplash_download_h]"><strong>'.__('Max Image Upload Height:', 'instant-images').'</strong></label>';
	echo '<input type="number" id="instant_img_settings[unsplash_download_h]" name="instant_img_settings[unsplash_download_h]" value="'.$options['unsplash_download_h'].'" class="sm" step="20" max="3200" /> ';
}
