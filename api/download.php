<?php
/**
 * Custom API route for download and adding images to media library.
 *
 * @author ConnektMedia <support@connekthq.com>
 * @since 3.0
 * @package InstantImages
 */

add_action(
	'rest_api_init',
	function () {
		$my_namespace = 'instant-images';
		$my_endpoint  = '/download';
		register_rest_route(
			$my_namespace,
			$my_endpoint,
			[
				'methods'             => 'POST',
				'callback'            => 'instant_images_download',
				'permission_callback' => function () {
					return InstantImages::instant_img_has_access();
				},
			]
		);
	}
);

/**
 * Resize Image and run through media uploader process.
 *
 * @param WP_REST_Request $request Rest request object.
 * @return $response
 * @author ConnektMedia <support@connekthq.com>
 * @package InstantImages
 */
function instant_images_download( WP_REST_Request $request ) {
	if ( ! InstantImages::instant_img_has_access() ) {
		// Exit if not allowed.
		$response = [
			'success'    => false,
			'msg'        => __( 'You do not have sufficient access to upload images with Instant Images.', 'instant-images' ),
			'id'         => '',
			'attachment' => '',
			'url'        => '',
		];
		wp_send_json( $response );
	}

	// Global settings.
	$settings = InstantImages::instant_img_get_settings();

	// Core WP includes.
	require_once ABSPATH . 'wp-admin/includes/file.php';
	require_once ABSPATH . 'wp-admin/includes/image.php';

	// Get JSON Data.
	$data = json_decode( $request->get_body(), true ); // Get contents of request body.

	if ( $data ) {
		$provider    = $data['provider'];
		$id          = $data['id']; // Image ID.
		$image_url   = instant_images_generate_image_url( $provider, $data['image_url'], $settings->max_width, $settings->max_height ); // Image URL.
		$filename    = sanitize_text_field( $data['filename'] ); // The filename.
		$extension   = sanitize_text_field( $data['extension'] ); // File extension.
		$title       = sanitize_text_field( $data['title'] ); // Title.
		$alt         = sanitize_text_field( $data['alt'] ); // Alt text.
		$caption     = wp_kses_post( $data['caption'] ); // Caption text.
		$description = ''; // Post Content.
		$cfilename   = sanitize_title( $data['custom_filename'] ); // Custom filename.
		$lang        = sanitize_text_field( $data['lang'] ); // Media language.
		$parent_id   = $data['parent_id'] ? sanitize_title( $data['parent_id'] ) : 0; // Parent post ID.

		$name = ! empty( $cfilename ) ? $cfilename : $filename; // Actual filename.
		$name = $name . '.' . $extension; // Add file extension.

		$has_error = false;
		$error_msg = '';

		if ( $provider !== 'unsplash' ) {

			/**
			 * Remove querystring from the URL.
			 *
			 * Example: photo.jpg?size=lg -> photo.jpg.
			 */
			$url = strtok( $image_url, '?' );

			/**
			 * Check if file mime type is allowed.
			 *
			 * @see https://developer.wordpress.org/reference/functions/wp_check_filetype/
			 */
			$file_type = wp_check_filetype( $url );

			if ( ! $file_type || ! $file_type['ext'] && $provider ) {
				$has_error = true;

				// translators: File extension.
				$error_msg = sprintf( esc_attr__( 'File mime type (.%1$s) is not allowed. Use the `upload_mimes` WP hook to add support for this mime type.', 'instant-images' ), $extension );
			}
		}

		// Check if file exists on remote server.
		if ( ! instant_images_remote_file_exists( $image_url ) ) {
			$has_error = true;
			$error_msg = __( 'Image file does not exist on remote server or there was an error accessing the file.', 'instant-images' );
		}

		// Handle errors.
		if ( $has_error ) {
			$response = [
				'success'    => false,
				'msg'        => $error_msg,
				'id'         => $id,
				'attachment' => '',
				'admin_url'  => admin_url(),
			];
			wp_send_json( $response );
		}

		// Send request to `wp_safe_remote_get`.
		$response = wp_safe_remote_get( $image_url );
		if ( is_wp_error( $response ) ) {
			return new WP_Error( 100, __( 'Image download failed, please try again. Errors:', 'instant-images' ) . PHP_EOL . $response->get_error_message() );
		}

		// Get Headers.
		$type = wp_remote_retrieve_header( $response, 'content-type' );
		if ( ! $type ) {
			return new WP_Error( 100, __( 'Image type could not be determined.', 'instant-images' ) );
		}

		// Upload remote file.
		$mirror = wp_upload_bits( $name, null, wp_remote_retrieve_body( $response ) );

		// Build Attachment Data Array.
		$attachment = [
			'post_title'     => $title,
			'post_excerpt'   => $caption,
			'post_content'   => $description,
			'post_status'    => 'inherit',
			'post_mime_type' => $type,
		];

		if ( ! $mirror['file'] ) {
			return new WP_Error( 500, __( 'Attachment file not found prior to upload.', 'instant-images' ) );
		}

		// Insert as attachment.
		$image_id = wp_insert_attachment( $attachment, $mirror['file'], $parent_id );

		// Add alt text as postmeta.
		update_post_meta( $image_id, '_wp_attachment_image_alt', $alt );

		// Set media language.
		if ( $lang && function_exists( 'pll_set_post_language' ) ) {
			pll_set_post_language( $image_id, $lang ); // Polylang.
		}

		// Generate metadata.
		$attach_data = wp_generate_attachment_metadata( $image_id, $mirror['file'] );
		wp_update_attachment_metadata( $image_id, $attach_data );

		/**
		 * Instant Images Core Hook.
		 * Fired after a successful image upload to media library.
		 *
		 * @since 4.4.0
		 */
		do_action(
			'instant_images_after_upload',
			[
				'filename'       => $name,
				'id'             => $id,
				'title'          => $title,
				'alt'            => $alt,
				'caption'        => $caption,
				'attachment_id'  => $image_id,
				'attachment_url' => wp_get_attachment_url( $image_id ),
				'provider'       => $provider,
				'original_url'   => $image_url,
			]
		);

		// Success.
		$response = [
			'success'    => true,
			'msg'        => __( 'Image successfully uploaded to the media library!', 'instant-images' ),
			'id'         => $id,
			'admin_url'  => admin_url(),
			'attachment' => [
				'id'          => $image_id,
				'url'         => wp_get_attachment_url( $image_id ),
				'edit_url'    => get_edit_post_link( $image_id ),
				'alt'         => $alt,
				'caption'     => $caption,
				'description' => $description,
			],
		];
		wp_send_json( $response );

	} else {
		$response = [
			'success'    => false,
			'msg'        => __( 'There was an error getting image details from the request, please try again.', 'instant-images' ),
			'id'         => '',
			'attachment' => '',
			'url'        => '',
		];
		wp_send_json( $response );

	}
}

/**
 * Generate an image URL with cropping params.
 *
 * @param  string $provider   The image provider.
 * @param  string $url        The image url.
 * @param  string $max_width  The max width of the image.
 * @param  string $max_height The max height of the image.
 * @return string             The image path.
 * @since 4.6
 * @author ConnektMedia <support@connekthq.com>
 * @package InstantImages
 */
function instant_images_generate_image_url( $provider, $url, $max_width, $max_height ) {
	/**
	 * Security check.
	 * Confirm image URL does NOT contains relative path.
	 */
	if ( false !== strpos( $url, './' ) ) {
		return false;
	}

	// Get all potential download URLs.
	$download_urls = InstantImages::instant_images_download_urls();

	// Parse $url to create URL array.
	$host = wp_parse_url( $url );

	// Construct a host url from the parsed $url. e.g. https://images.unsplash.com.
	$host_url = $host['scheme'] . '://' . $host['host'];

	/**
	 * Security check.
	 * Check image download URL is valid, allowed and supported by Instant Images.
	 */
	if ( ! in_array( $host_url, $download_urls, true ) ) {
		return false;
	}

	$image_url = '';

	switch ( $provider ) {
		case 'unsplash':
			$image_url = $url . '&fit=clip&w=' . $max_width . '&h=' . $max_height;
			break;

		case 'pexels':
			$image_url = $url . '?dpr=1&w=' . $max_width . '&h=' . $max_height;
			break;

		default:
			$image_url = $url;
			break;
	}
	return $image_url;
}

/**
 * Check if a remote image file exists.
 *
 * @param  string $url The url to the remote image.
 * @return bool        Whether the remote image exists.
 * @since 3.0
 * @author ConnektMedia <support@connekthq.com>
 * @package InstantImages
 */
function instant_images_remote_file_exists( $url ) {
	$response = wp_remote_head( $url );
	return 200 === wp_remote_retrieve_response_code( $response );
}
