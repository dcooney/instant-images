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
	$providers = InstantImages::instant_img_get_providers();

	// General Settings.
	register_setting(
		'instant_images_general_settings_group',
		'instant_img_settings',
		'instant_images_sanitize'
	);

	add_settings_section(
		'instant_images_general_settings',
		__( 'General Settings', 'instant-images' ),
		'instant_images_general_settings_callback',
		'instant-images'
	);

	// Download Width.
	add_settings_field(
		'unsplash_download_w',
		__( 'Upload Image Width', 'instant-images' ),
		'instant_images_width_callback',
		'instant-images',
		'instant_images_general_settings'
	);

	// Download Height.
	add_settings_field(
		'unsplash_download_h',
		__( 'Upload Image Height', 'instant-images' ),
		'instant_images_height_callback',
		'instant-images',
		'instant_images_general_settings'
	);

	// Default Provider.
	add_settings_field(
		'default_provider',
		__( 'Default Image Provider', 'instant-images' ),
		'instant_images_default_provider',
		'instant-images',
		'instant_images_general_settings'
	);

	// Auto captions.
	add_settings_field(
		'auto_attribution',
		__( 'Auto Captions/Attribution', 'instant-images' ),
		'instant_images_auto_attribution_callback',
		'instant-images',
		'instant_images_general_settings'
	);

	// Media Modal.
	add_settings_field(
		'media_modal_display',
		__( 'Media Tab', 'instant-images' ),
		'instant_images_tab_display_callback',
		'instant-images',
		'instant_images_general_settings'
	);

	// API Keys.
	register_setting(
		'instant_images_api_settings_group',
		'instant_img_api_settings',
		'instant_images_sanitize'
	);

	add_settings_section(
		'instant_images_api_settings',
		__( 'API Keys', 'instant-images' ),
		'instant_images_api_settings_callback',
		'instant-images-api'
	);

	// Upgrade routine.
	$general_options  = get_option( 'instant_img_settings' ); // General options.
	$api_options      = get_option( 'instant_img_api_settings' ); // API options.
	$settings_updated = get_option( 'instant_img_settings_updated' );

	// Providers API Keys.
	$upgrade_routine = [];
	$count           = 0;
	foreach ( $providers as $provider ) {
		if ( $provider['requires_key'] ) {
			$count++;
			$key   = $provider['slug'] . '_api';
			$title = $provider['name'] . __( 'API Key', 'instant-images' );

			// Upgrade routine.
			if ( ! $settings_updated && isset( $general_options [ $key ] ) && $general_options [ $key ] ) {
				$upgrade_routine[ $key ] = $general_options [ $key ];
				update_option( 'instant_img_api_settings', $upgrade_routine );
				unset( $general_options [ $key ] );
				update_option( 'instant_img_settings', $general_options );
				update_option( 'instant_img_settings_updated', true );
			}

			add_settings_field(
				$key,
				$title,
				'instant_images_api_keys_callback',
				'instant-images-api',
				'instant_images_api_settings',
				[ $provider ]
			);
		}
	}

}
add_action( 'admin_init', 'instant_images_admin_init' );

/**
 * General settings text.
 *
 * @author ConnektMedia <support@connekthq.com>
 * @since 1.0
 */
function instant_images_general_settings_callback() {
	echo '<p class="desc">' . esc_attr__( 'Manage your media upload settings.', 'instant-images' ) . '</p>';
}

/**
 * API Key settings text.
 *
 * @author ConnektMedia <support@connekthq.com>
 * @since 5.3
 */
function instant_images_api_settings_callback() {
	echo '<p class="desc">' . esc_attr__( 'Manage your provider API keys.', 'instant-images' ) . '</p>';
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

	echo '<label for="instant_img_settings[unsplash_download_w]">' . esc_attr__( 'Max Image Upload Width', 'instant-images' ) . '</label>';
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

	echo '<label for="instant_img_settings[unsplash_download_h]">' . esc_attr__( 'Max Image Upload Height', 'instant-images' ) . '</label>';
	echo '<input type="number" id="instant_img_settings[unsplash_download_h]" name="instant_img_settings[unsplash_download_h]" value="' . esc_attr( $options['unsplash_download_h'] ) . '" class="sm" step="20" max="4800" /> ';
}

/**
 * Automatically add image attribution to captions.
 *
 * @author ConnektMedia <support@connekthq.com>
 * @since 5.2.0
 */
function instant_images_auto_attribution_callback() {
	$options = get_option( 'instant_img_settings' );
	if ( ! isset( $options['auto_attribution'] ) ) {
		$options['auto_attribution'] = '0';
	}

	$html  = '<div class="fake-label">' . esc_attr__( 'Image Attribution', 'instant-images' ) . '</div>';
	$html .= '<label for="auto_attribution" class="instant-images-checkbox">';
	$html .= '<input type="hidden" name="instant_img_settings[auto_attribution]" value="0" />';
	$html .= '<input type="checkbox" name="instant_img_settings[auto_attribution]" id="auto_attribution" value="1"' . ( $options['auto_attribution'] ? ' checked="checked"' : '' ) . ' />';
	$html .= '<div class="instant-images-checkbox--switch">';
	$html .= '<div class="toggle-switch"></div>';
	$html .= '<div class="toggle-label">' . __( 'Automatically add image attribution (as captions) when uploading images.', 'instant-images' ) . '</div>';
	$html .= '</div>';
	$html .= '</label>';

	echo $html; // phpcs:ignore
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

	$html  = '<div class="fake-label">' . esc_attr__( 'Media Modal', 'instant-images' ) . '</div>';
	$html .= '<label for="media_modal_display" class="instant-images-checkbox">';
	$html .= '<input type="hidden" name="instant_img_settings[media_modal_display]" value="0" />';
	$html .= '<input type="checkbox" name="instant_img_settings[media_modal_display]" id="media_modal_display" value="1"' . ( $options['media_modal_display'] ? ' checked="checked"' : '' ) . ' />';
	$html .= '<div class="instant-images-checkbox--switch">';
	$html .= '<div class="toggle-switch"></div>';
	$html .= '<div class="toggle-label">' . __( 'Hide Instant Images tab in Media Modal windows.', 'instant-images' ) . '</div>';
	$html .= '</div>';
	$html .= '</label>';

	echo $html; // phpcs:ignore
}

/**
 * Set the default image provider.
 *
 * @author ConnektMedia <support@connekthq.com>
 * @since 4.5
 */
function instant_images_default_provider() {
	$providers = InstantImages::instant_img_get_providers();
	$options   = get_option( 'instant_img_settings' );
	if ( ! isset( $options['default_provider'] ) ) {
		$options['default_provider'] = 'unsplash';
	}
	?>
	<label for="default_provider"><?php esc_attr_e( 'Default Provider', 'instant-images' ); ?></label>
	<select id="default_provider" name="instant_img_settings[default_provider]">
		<?php foreach ( $providers as $provider ) { ?>
			<option value="<?php echo esc_html( $provider['slug'] ); ?>" <?php selected( esc_html( $provider['slug'] ), $options['default_provider'] ); ?>>
				<?php echo esc_html( $provider['name'] ); ?>
			</option>
		<?php } ?>
	</select>
	<?php
}

/**
 * Set the API keys for each required provider.
 *
 * @param array $args Provider arguments.
 * @author ConnektMedia <support@connekthq.com>
 * @since 5.3
 */
function instant_images_api_keys_callback( $args = [] ) {
	$provider = isset( $args[0] ) && isset( $args[0] ) ? $args[0] : false;
	if ( ! $provider ) {
		// Bail early if no provider is set.
		return;
	}

	$options  = get_option( 'instant_img_api_settings' ); // API options.
	$key      = $provider['slug'] . '_api';
	$title    = $provider['name'];
	$constant = $provider['constant'];
	$url      = $provider['url'];
	$readonly = '';
	$disabled = '';

	if ( defined( $constant ) ) {
		$readonly        = ' readonly';
		$disabled        = ' disabled';
		$options[ $key ] = constant( $constant );
	} else {
		if ( ! isset( $options[ $key ] ) ) {
			$options[ $key ] = '';
		}
	}

	echo '<label class="provider-label" for="instant_img_api_settings[' . esc_attr( $key ) . ']">';
	echo esc_attr( ucfirst( $title ) ) . ' ' . esc_attr__( 'API Key', 'instant-images' );
	echo '<a href="' . esc_url( $url ) . '" target="_blank">&rarr; ' . esc_attr__( 'Get Key', 'instant-images' ) . '</a>';
	echo '</label>';
	echo '<input type="text" id="instant_img_api_settings[' . esc_attr( $key ) . ']" name="instant_img_api_settings[' . esc_attr( $key ) . ']" value="' . esc_attr( $options[ '' . esc_attr( $key ) . '' ] ) . '" ' . esc_attr( $readonly ) . esc_attr( $disabled ) . ' />';

	if ( defined( $constant ) ) {
		echo '<div class="api-constant">' . esc_attr__( 'API key has been set via site constant.', 'instant-images' ) . '</div>';
	}
}

/**
 * Empty callback function for the API Key switcher.
 *
 * @author ConnektMedia <support@connekthq.com>
 * @since 4.6
 */
function instant_images_callable() {
	return null;
}
