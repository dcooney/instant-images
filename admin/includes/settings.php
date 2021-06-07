<?php
/**
 * Instant Images Settings.
 *
 * @package InstantImages
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Initiate the plugin setting, create settings variables.
 *
 * @author ConnektMedia <support@connekthq.com>
 * @since 2.0
 */
function instant_images_admin_init() {
	register_setting(
		'instant-img-setting-group',
		'instant_img_settings',
		'instant_images_sanitize'
	);

	add_settings_section(
		'unsplash_general_settings',
		__( 'Global Settings', 'instant-images' ),
		'instant_images_general_settings_callback',
		'instant-images'
	);

	// Download Width.
	add_settings_field(
		'unsplash_download_w',
		__( 'Upload Image Width', 'instant-images' ),
		'instant_images_width_callback',
		'instant-images',
		'unsplash_general_settings'
	);

	// Download Height.
	add_settings_field(
		'unsplash_download_h',
		__( 'Upload Image Height', 'instant-images' ),
		'instant_images_height_callback',
		'instant-images',
		'unsplash_general_settings'
	);

	// Button Display.
	add_settings_field(
		'media_modal_display',
		__( 'Media Tab', 'instant-images' ),
		'instant_images_tab_display_callback',
		'instant-images',
		'unsplash_general_settings'
	);

}
add_action( 'admin_init', 'instant_images_admin_init' );

/**
 * Some general settings text.
 *
 * @author ConnektMedia <support@connekthq.com>
 * @since 1.0
 */
function instant_images_general_settings_callback() {
	echo '<p class="desc">' . esc_attr__( 'Manage your media upload settings.', 'instant-images' ) . '</p>';
}

/**
 * Sanitize form fields.
 *
 * @author ConnektMedia <support@connekthq.com>
 * @since 1.0
 * @param array $input Array of field values.
 * @return array $output Sanitized field values.
 */
function instant_images_sanitize( $input ) {

	// Create our array for storing the validated options.
	$output = array();
	// Loop through each of the incoming options.
	foreach ( $input as $key => $value ) {
		// Check to see if the current option has a value. If so, process it.
		if ( isset( $input[ $key ] ) ) {
			// Strip all HTML and PHP tags and properly handle quoted strings.
			$output[ $key ] = wp_strip_all_tags( stripslashes( $input[ $key ] ) );
		}
	}

	// Return the array processing any additional functions filtered by this action.
	return apply_filters( 'instant_images_validate_input_settings', $output, $input );
}

/**
 * Max File download width.
 *
 * @author ConnektMedia <support@connekthq.com>
 * @since 1.0
 */
function instant_images_width_callback() {
	$options = get_option( 'instant_img_settings' );

	if ( ! isset( $options['unsplash_download_w'] ) ) {
		$options['unsplash_download_w'] = '1600';
	}

	echo '<label for="instant_img_settings[unsplash_download_w]"><strong>' . esc_attr__( 'Max Image Upload Width:', 'instant-images' ) . '</strong></label>';
	echo '<input type="number" id="instant_img_settings[unsplash_download_w]" name="instant_img_settings[unsplash_download_w]" value="' . esc_attr( $options['unsplash_download_w'] ) . '" class="sm" step="20" max="4800" /> ';
}

/**
 * Max File download height.
 *
 * @author ConnektMedia <support@connekthq.com>
 * @since 1.0
 */
function instant_images_height_callback() {
	$options = get_option( 'instant_img_settings' );

	if ( ! isset( $options['unsplash_download_h'] ) ) {
		$options['unsplash_download_h'] = '1200';
	}

	echo '<label for="instant_img_settings[unsplash_download_h]"><strong>' . esc_attr__( 'Max Image Upload Height:', 'instant-images' ) . '</strong></label>';
	echo '<input type="number" id="instant_img_settings[unsplash_download_h]" name="instant_img_settings[unsplash_download_h]" value="' . esc_attr( $options['unsplash_download_h'] ) . '" class="sm" step="20" max="4800" /> ';
}

/**
 * Show the Instant Images Tab in Media Modal.
 *
 * @author ConnektMedia <support@connekthq.com>
 * @since 3.2.1
 */
function instant_images_tab_display_callback() {
	$options = get_option( 'instant_img_settings' );
	if ( ! isset( $options['media_modal_display'] ) ) {
		$options['media_modal_display'] = '0';
	}

	$style = 'style="position: absolute; left: 0; top: 9px;"';

	$html  = '<label style="cursor: default;"><strong>' . esc_attr__( 'Media Modal:', 'instant-images' ) . '</strong></label>';
	$html .= '<label for="media_modal_display" style="padding-left: 24px; position: relative;">';
	$html .= '<input type="hidden" name="instant_img_settings[media_modal_display]" value="0" />';
	$html .= '<input ' . $style . ' type="checkbox" name="instant_img_settings[media_modal_display]" id="media_modal_display" value="1"' . ( $options['media_modal_display'] ? ' checked="checked"' : '' ) . ' />';
	$html .= __( 'Hide the <b>Instant Images</b> tab in admin Media Modal windows.', 'instant-images' );
	$html .= '</label>';

	// @codingStandardsIgnoreStart
	echo $html;
	// @codingStandardsIgnoreEnd
}
