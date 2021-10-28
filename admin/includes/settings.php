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

	// Default Provider.
	add_settings_field(
		'default_provider',
		__( 'Default Image Provider', 'instant-images' ),
		'instant_images_default_provider',
		'instant-images',
		'unsplash_general_settings'
	);

	// Pixabay API Key.
	add_settings_field(
		'pixabay_api',
		__( 'Pixabay API Key', 'instant-images' ),
		'instant_images_pixabay_api_callback',
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

	$html  = '<label style="cursor: default;"><strong>' . esc_attr__( 'Media Modal:', 'instant-images' ) . '</strong></label>';
	$html .= '<label for="media_modal_display">';
	$html .= '<input type="hidden" name="instant_img_settings[media_modal_display]" value="0" />';
	$html .= '<input type="checkbox" name="instant_img_settings[media_modal_display]" id="media_modal_display" value="1"' . ( $options['media_modal_display'] ? ' checked="checked"' : '' ) . ' />';
	$html .= __( 'Hide Instant Images tab in Media Modal windows.', 'instant-images' );
	$html .= '</label>';

	// @codingStandardsIgnoreStart
	echo $html;
	// @codingStandardsIgnoreEnd
}

/**
 * Set the default image provider.
 *
 * @author ConnektMedia <support@connekthq.com>
 * @since 4.5
 */
function instant_images_default_provider() {
	$options = get_option( 'instant_img_settings' );
	if ( ! isset( $options['default_provider'] ) ) {
		$options['default_provider'] = 'unsplash';
	}
	?>
	<label for="default_provider" style="cursor: default; margin-bottom: 3px;">
		<strong><?php esc_attr_e( 'Default Provider:', 'instant-images' ); ?></strong>
	</label>
	<select id="default_provider" name="instant_img_settings[default_provider]">
		<option value="unsplash" <?php selected( 'unsplash', $options['default_provider'] ); ?>><?php esc_attr_e( 'Unsplash', 'instant-images' ); ?></option>
		<option value="pixabay" <?php selected( 'pixabay', $options['default_provider'] ); ?>><?php esc_attr_e( 'Pixabay', 'instant-images' ); ?> (<?php esc_attr_e( 'Requires API Key', 'instant-images' ); ?>)</option>
	</select>
	<?php
}

/**
 * Set the Pizabay API key.
 *
 * @author ConnektMedia <support@connekthq.com>
 * @since 4.5
 */
function instant_images_pixabay_api_callback() {
	$options = get_option( 'instant_img_settings' );
	if ( ! isset( $options['pixabay_api'] ) ) {
		$options['pixabay_api'] = '';
	}
	?>
	<label for="pixabay_api" style="cursor: default; margin-bottom: 3px;">
		<strong><?php esc_attr_e( 'Pixabay API Key:', 'instant-images' ); ?></strong>
	</label>
	<input type="text" id="pixabay_api" name="instant_img_settings[pixabay_api]" value="<?php echo wp_kses_post( $options['pixabay_api'] ); ?>" >
	<span class="desc">&rarr; <a href="https://pixabay.com/" target="_blank"><?php esc_attr_e( 'Get API Key', 'instant-images' ); ?></a></span>
	<?php
}
