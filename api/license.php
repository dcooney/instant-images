<?php
/**
 * Custom /license route to update plugin licenses.
 *
 * @author ConnektMedia <support@connekthq.com>
 * @since 6.0.0
 * @package InstantImages
 */

add_action(
	'rest_api_init',
	function () {
		$my_namespace = 'instant-images';
		$my_endpoint  = '/license';
		register_rest_route(
			$my_namespace,
			$my_endpoint,
			array(
				'methods'             => 'POST',
				'callback'            => 'instant_images_license',
				'permission_callback' => function () {
					return InstantImages::instant_img_has_access();
				},
			)
		);
	}
);

/**
 * Save plugin license details.
 *
 * @param WP_REST_Request $request API request.
 * @author ConnektMedia <support@connekthq.com>
 * @package InstantImages
 */
function instant_images_license( WP_REST_Request $request ) {
	if ( InstantImages::instant_img_has_access() ) {

		// Get JSON Data.
		$data = json_decode( $request->get_body(), true ); // Get contents of request body.

		if ( $data ) {
			$type          = $data['type'] ? $data['type'] : 'activate'; // The type of license action.
			$license       = $data['license'] ? $data['license'] : ''; // The type of license action.
			$option_key    = $data['key'] ? $data['key'] : false;
			$option_status = $data['status'] ? $data['status'] : false;
			$item_id       = $data['id'] ? $data['id'] : ''; // The item ID in EDD.
			$type          = ! $license ? 'deactivate' : $type; // Set to deactivate if no license.

			if ( ! $option_key || ! $option_status || ! $item_id ) {
				return false;
			}

			// API Action.
			if ( $type === 'activate' || $type === 'check' ) {
				$action = 'activate_license';
			} else {
				$action = 'deactivate_license';
			}

			// Create the params for the request.
			$api_params = array(
				'edd_action'  => $action,
				'license'     => $license,
				'item_id'     => $item_id, // the ID of our product in EDD.
				'url'         => home_url(),
				'environment' => function_exists( 'wp_get_environment_type' ) ? wp_get_environment_type() : 'production',
			);

			// Call Store API.
			$response = wp_safe_remote_post(
				INSTANT_IMAGES_STORE_URL,
				array(
					'method'    => 'POST',
					'body'      => $api_params,
					'timeout'   => 30,
					'sslverify' => false,
				)
			);

			// Make sure the response came back okay.
			if ( is_wp_error( $response ) ) {
				wp_send_json( $response );
			}

			$license_data   = $response['body'];
			$license_data   = json_decode( $license_data ); // decode the license data.
			$license_status = isset( $license_data->error ) ? $license_data->error : $license_data->license;

			// Update the options table.
			update_option( $option_key, $license );
			update_option( $option_status, $license_status );

			// Send a response.
			wp_send_json( true );
		}
	}

}
