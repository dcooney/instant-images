<?php
/**
 * Custom /v5_upgrade_dismissal route to acknowledge proxy changes.
 *
 * @since 5.0
 * @author ConnektMedia <support@connekthq.com>
 * @package InstantImages
 */

add_action(
	'rest_api_init',
	function () {
		$my_namespace = 'instant-images';
		$my_endpoint  = '/v5_upgrade_dismissal';
		register_rest_route(
			$my_namespace,
			$my_endpoint,
			array(
				'methods'             => 'POST',
				'callback'            => 'instant_images_v5_upgrade_dismissal',
				'permission_callback' => function () {
					return InstantImages::instant_img_has_access();
				},
			)
		);
	}
);

/**
 * V5 Upgrade Endpoint.
 *
 * @param WP_REST_Request $request API request.
 * @since 5.0
 * @author ConnektMedia <support@connekthq.com>
 * @package InstantImages
 */
function instant_images_v5_upgrade_dismissal( WP_REST_Request $request ) {

	if ( InstantImages::instant_img_has_access() ) {

		set_transient( 'instant_images_v5_upgrade_notice', 'true', 0 );

		// Access is enable, send the response.
		$response = array( 'success' => true );

		// Send response as JSON.
		wp_send_json( $response );
	}
}
