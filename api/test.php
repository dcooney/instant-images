<?php
/**
 * Custom /test route to text REST API access.
 *
 * @since 3.0
 * @author ConnektMedia <support@connekthq.com>
 * @package InstantImages
 */

add_action(
	'rest_api_init',
	function () {
		$my_namespace = 'instant-images';
		$my_endpoint  = '/test';
		register_rest_route(
			$my_namespace,
			$my_endpoint,
			[
				'methods'             => 'POST',
				'callback'            => 'instant_images_test',
				'permission_callback' => function () {
					return InstantImages::instant_img_has_access();
				},
			]
		);
	}
);

/**
 * Test REST API access
 *
 * @author ConnektMedia <support@connekthq.com>
 * @package InstantImages
 */
function instant_images_test() {
	if ( InstantImages::instant_img_has_access() ) {
		// Access is enable, send the response.
		wp_send_json( [ 'success' => true ] );
	}
}
