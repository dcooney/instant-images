<?php
/**
 * Custom /resize route
 *
 * @since 3.0
 * @author dcooney
 * @package InstantImages
 */

add_action(
	'rest_api_init',
	function () {
		$my_namespace = 'instant-images';
		$my_endpoint  = '/settings';
		register_rest_route(
			$my_namespace,
			$my_endpoint,
			array(
				'methods'             => 'POST',
				'callback'            => 'instant_images_settings',
				'permission_callback' => function () {
					return InstantImages::instant_img_has_access();
				},
			)
		);
	}
);

/**
 * Save plugin settings.
 *
 * @param WP_REST_Request $request API request.
 * @since 4.5
 * @author dcooney
 * @package InstantImages
 */
function instant_images_settings( WP_REST_Request $request ) {

	if ( InstantImages::instant_img_has_access() ) {

		// Global settings.
		$options = get_option( 'instant_img_settings' );

		// Access is enable, send the response.
		$response = array( 'success' => true );

		// Send response as JSON.
		wp_send_json( $response );
	}

}
