<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * Initiate the plugin setting, create settings variables.
 * @since 2.0
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
		__('Global Settings', 'instant-images'),
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

	// Button Display
	add_settings_field(
		'media_modal_display',
		__('Media Tab', 'instant-images' ),
		'instant_images_tab_display_callback',
		'instant-images',
		'unsplash_general_settings'
	);

}

/**
 * Some general settings text
 * @since 1.0
 */
function unsplash_general_settings_callback() {
    echo '<p class="desc">' . __('Manage your media upload settings.', 'instant-images') . '</p>';
}


/**
 * Sanitize form fields
 * @since 1.0
 */
function unsplash_sanitize( $input ) {
    return $input;
}

/**
 * Max File download width
 * @since 1.0
 */
function unsplash_download_w_callback(){
	$options = get_option( 'instant_img_settings' );

	if(!isset($options['unsplash_download_w']))
	   $options['unsplash_download_w'] = '1600';

	echo '<label for="instant_img_settings[unsplash_download_w]"><strong>'.__('Max Image Upload Width:', 'instant-images').'</strong></label>';
	echo '<input type="number" id="instant_img_settings[unsplash_download_w]" name="instant_img_settings[unsplash_download_w]" value="'.$options['unsplash_download_w'].'" class="sm" step="20" max="3200" /> ';
}

/**
 * Max File download height
 * @since 1.0
 */
function unsplash_download_h_callback(){
	$options = get_option( 'instant_img_settings' );

	if(!isset($options['unsplash_download_h']))
	   $options['unsplash_download_h'] = '1200';

	echo '<label for="instant_img_settings[unsplash_download_h]"><strong>'.__('Max Image Upload Height:', 'instant-images').'</strong></label>';
	echo '<input type="number" id="instant_img_settings[unsplash_download_h]" name="instant_img_settings[unsplash_download_h]" value="'.$options['unsplash_download_h'].'" class="sm" step="20" max="3200" /> ';
}

/**
 * Show the Instant Images Tab in Media Modal
 * @since 3.2.1
 */
function instant_images_tab_display_callback(){
	$options = get_option( 'instant_img_settings' );
	if(!isset($options['media_modal_display']))
	   $options['media_modal_display'] = '0';

	$style = 'style="position: absolute; left: 0; top: 9px;"'; // CSS style

	$html =  '<label style="cursor: default;"><strong>'.__('Media Modal:', 'instant-images').'</strong></label>';
	$html .= '<label for="media_modal_display" style="padding-left: 24px; position: relative;">';
		$html .= '<input type="hidden" name="instant_img_settings[media_modal_display]" value="0" />';
		$html .= '<input '. $style .' type="checkbox" name="instant_img_settings[media_modal_display]" id="media_modal_display" value="1"'. (($options['media_modal_display']) ? ' checked="checked"' : '') .' />';
		$html .= __('Hide the <b>Instant Images</b> tab in admin Media Modal windows.', 'instant-images');
	$html .= '</label>';

	echo $html;
}
