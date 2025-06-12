<?php
/**
 * Plugin Name: Instant Images
 * Plugin URI: https://connekthq.com/plugins/instant-images/
 * Description: One-click image uploads directly to your media library from Unsplash, Openverse, Pixabay and Pexels.
 * Author: Darren Cooney
 * Twitter: @connekthq
 * Author URI: https://connekthq.com
 * Text Domain: instant-images
 * Version: 7.0.2
 * License: GPL
 * Copyright: Darren Cooney & Connekt Media
 *
 * @package InstantImages
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'INSTANT_IMAGES_VERSION', '7.0.2' );
define( 'INSTANT_IMAGES_RELEASE', 'June 12, 2025' );
define( 'INSTANT_IMAGES_STORE_URL', 'https://getinstantimages.com' );

/**
 * InstantImages class
 *
 * @author ConnektMedia <support@connekthq.com>
 * @since 2.0
 */
class InstantImages {

	/**
	 * Set up plugin.
	 *
	 * @author ConnektMedia <support@connekthq.com>
	 * @since 2.0
	 */
	public function __construct() {
		add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_block_editor' ] );
		add_action( 'wp_enqueue_media', [ $this, 'enqueue_media' ] );
		add_action( 'init', [ $this, 'load_plugin_textdomain' ] );

		add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), [ $this, 'add_action_links' ] );

		$this->includes();
		$this->constants();
	}

	/**
	 * Load the plugin text domain for translations.
	 *
	 * @return void
	 */
	public function load_plugin_textdomain() {
		load_plugin_textdomain( 'instant-images', false, dirname( plugin_basename( __FILE__ ) ) . '/lang/' ); // load text domain.
	}

	/**
	 * Include these files in the admin
	 *
	 * @author ConnektMedia <support@connekthq.com>
	 * @since 2.0
	 */
	private function includes() {
		if ( is_admin() ) {
			require_once __DIR__ . '/admin/admin.php';
			require_once __DIR__ . '/admin/includes/settings.php';
			require_once __DIR__ . '/admin/vendor/connekt-plugin-installer/class-connekt-plugin-installer.php';

			if ( ! class_exists( 'EDD_SL_Plugin_Updater' ) ) {
				// Only include this EDD helper if other plugins have not.
				require_once __DIR__ . '/admin/vendor/EDD_SL_Plugin_Updater.php';
			}
		}

		// API Routes.
		require_once 'api/test.php';
		require_once 'api/download.php';
		require_once 'api/settings.php';
		require_once 'api/license.php';
	}

	/**
	 * Set up plugin constants.
	 *
	 * @author ConnektMedia <support@connekthq.com>
	 * @since 2.0
	 */
	private function constants() {
		$upload_dir = wp_upload_dir();
		define( 'INSTANT_IMAGES_TITLE', 'Instant Images' );
		define( 'INSTANT_IMAGES_UPLOAD_PATH', $upload_dir['basedir'] . '/instant-images' );
		define( 'INSTANT_IMAGES_UPLOAD_URL', $upload_dir['baseurl'] . '/instant-images/' );
		define( 'INSTANT_IMAGES_PATH', plugin_dir_path( __FILE__ ) );
		define( 'INSTANT_IMAGES_URL', plugins_url( '/', __FILE__ ) );
		define( 'INSTANT_IMAGES_ADMIN_URL', plugins_url( 'admin/', __FILE__ ) );
		define( 'INSTANT_IMAGES_WPADMIN_URL', admin_url( 'upload.php?page=instant-images' ) );
		define( 'INSTANT_IMAGES_WPADMIN_SETTINGS_URL', admin_url( 'options-general.php?page=instant-images-settings' ) );
		define( 'INSTANT_IMAGES_SETTINGS', 'instant_img_settings' );
		define( 'INSTANT_IMAGES_API_SETTINGS', 'instant_img_api_settings' );
		define( 'INSTANT_IMAGES_NAME', 'instant-images' );
		define( 'INSTANT_IMAGES_ADDONS_URL', 'https://getinstantimages.com/add-ons/' );

		// Instant Images: Extended.
		if ( ! defined( 'INSTANT_IMAGES_EXTENDED_ID' ) ) {
			define( 'INSTANT_IMAGES_EXTENDED_ID', '96' );
		}
	}

	/**
	 * Get a list of all plugin providers.
	 *
	 * @return array The array of providers.
	 * @author ConnektMedia <support@connekthq.com>
	 * @since 4.6
	 */
	public static function instant_img_get_providers() {
		$providers = [
			[
				'name'         => 'Unsplash',
				'slug'         => 'unsplash',
				'requires_key' => true,
				'url'          => 'https://unsplash.com/developers',
				'constant'     => 'INSTANT_IMAGES_UNSPLASH_KEY',
			],
			[
				'name'         => 'Openverse',
				'slug'         => 'openverse',
				'requires_key' => false,
				'url'          => 'https://api.openverse.engineering/v1/#section/Register-and-Authenticate/Register-for-a-key',
				'constant'     => '',
			],
			[
				'name'         => 'Pixabay',
				'slug'         => 'pixabay',
				'requires_key' => true,
				'url'          => 'https://pixabay.com/service/about/api/',
				'constant'     => 'INSTANT_IMAGES_PIXABAY_KEY',
			],
			[
				'name'         => 'Pexels',
				'slug'         => 'pexels',
				'requires_key' => true,
				'url'          => 'https://www.pexels.com/join-consumer/',
				'constant'     => 'INSTANT_IMAGES_PEXELS_KEY',
			],
			[
				'name'         => 'Giphy',
				'slug'         => 'giphy',
				'requires_key' => true,
				'url'          => 'https://developers.giphy.com/',
				'constant'     => 'INSTANT_IMAGES_GIPHY_KEY',
			],
		];
		return $providers;
	}

	/**
	 * Get a list of potential download URLs to increase security of download functionality.
	 *
	 * @return array The array of urls.
	 * @author ConnektMedia <support@connekthq.com>
	 * @since 5.0
	 */
	public static function instant_images_download_urls() {
		$urls = [
			'https://images.unsplash.com',
			'https://pixabay.com',
			'https://images.pexels.com',
			'https://pd.w.org',
			'https://live.staticflickr.com',
			'https://upload.wikimedia.org',
			'https://media0.giphy.com',
			'https://media1.giphy.com',
			'https://media2.giphy.com',
			'https://media3.giphy.com',
			'https://media4.giphy.com',
			'https://media5.giphy.com',
		];
		return $urls;
	}


	/**
	 * Get global Instant Images plugin settings.
	 *
	 * @return object Settings as an STD object with defaults.
	 */
	public static function instant_img_get_settings() {
		// General plugin settings.
		$options          = get_option( INSTANT_IMAGES_SETTINGS );
		$max_width        = isset( $options['unsplash_download_w'] ) ? $options['unsplash_download_w'] : 1600; // width of download file.
		$max_height       = isset( $options['unsplash_download_h'] ) ? $options['unsplash_download_h'] : 1200; // height of downloads.
		$default_provider = isset( $options['default_provider'] ) ? $options['default_provider'] : 'unsplash'; // Default provider.
		$auto_attribution = isset( $options['auto_attribution'] ) ? $options['auto_attribution'] : '0'; // Default provider.

		// API Keys.
		$api_options  = get_option( INSTANT_IMAGES_API_SETTINGS );
		$unsplash_api = isset( $api_options['unsplash_api'] ) ? $api_options['unsplash_api'] : '';
		$unsplash_api = empty( $unsplash_api ) ? '' : $unsplash_api; // If empty, set to default key.
		$pixabay_api  = isset( $api_options['pixabay_api'] ) ? $api_options['pixabay_api'] : '';
		$pixabay_api  = empty( $pixabay_api ) ? '' : $pixabay_api; // If empty, set to default key.
		$pexels_api   = isset( $api_options['pexels_api'] ) ? $api_options['pexels_api'] : '';
		$pexels_api   = empty( $pexels_api ) ? '' : $pexels_api; // If empty, set to default key.
		$giphy_api    = isset( $api_options['giphy_api'] ) ? $api_options['giphy_api'] : '';
		$giphy_api    = empty( $giphy_api ) ? '' : $giphy_api; // If empty, set to default key.

		return (object) [
			'max_width'        => $max_width,
			'max_height'       => $max_height,
			'default_provider' => $default_provider,
			'auto_attribution' => $auto_attribution,
			'unsplash_api'     => $unsplash_api,
			'pixabay_api'      => $pixabay_api,
			'pexels_api'       => $pexels_api,
			'giphy_api'        => $giphy_api,
		];
	}

	/**
	 * Enqueue Block Editor sidebar plugin.
	 *
	 * @author ConnektMedia <support@connekthq.com>
	 * @since 3.0
	 */
	public function enqueue_block_editor() {
		$excluded_screens = apply_filters( 'instant_images_excluded_sidebar_screens', [ 'widgets', 'site-editor', 'woocommerce_page_wc-admin', 'toplevel_page_search-filter' ] );

		if ( $this::instant_img_has_access() && $this::instant_img_not_current_screen( $excluded_screens ) ) {
			// Plugin sidebar.
			$sidebar_asset_file = require INSTANT_IMAGES_PATH . 'build/plugin-sidebar/index.asset.php'; // Get webpack asset file.

			wp_enqueue_script(
				'instant-images-plugin-sidebar',
				INSTANT_IMAGES_URL . 'build/plugin-sidebar/index.js',
				$sidebar_asset_file['dependencies'],
				INSTANT_IMAGES_VERSION,
				true
			);

			wp_enqueue_style(
				'admin-instant-images',
				INSTANT_IMAGES_URL . 'build/style-instant-images.css',
				[ 'wp-edit-post' ],
				INSTANT_IMAGES_VERSION
			);

			// Image block.
			if ( $this::instant_images_addon_valid_license( 'extended' ) ) {
				$block_asset_file = require INSTANT_IMAGES_PATH . 'build/block/index.asset.php'; // Get webpack asset file.
				wp_enqueue_script(
					'instant-images-block',
					INSTANT_IMAGES_URL . 'build/block/index.js',
					$block_asset_file['dependencies'],
					INSTANT_IMAGES_VERSION,
					true
				);
			}

			$this::instant_img_localize( 'instant-images-plugin-sidebar' );
		}
	}

	/**
	 * Enqueue script for Media Modal and Blocks sidebar.
	 *
	 * @author ConnektMedia <support@connekthq.com>
	 * @since 4.0
	 */
	public function enqueue_media() {
		$show_tab       = $this::instant_img_show_tab( 'media_modal_display' ); // Show Tab Setting.
		$current_screen = is_admin() && function_exists( 'get_current_screen' ) ? get_current_screen()->base : ''; // Current admin screen.
		if ( $this::instant_img_has_access() && $show_tab && $current_screen !== 'upload' ) {
			$media_modal_asset_file = require INSTANT_IMAGES_PATH . 'build/media-modal/index.asset.php'; // Get webpack asset file.
			wp_enqueue_script(
				'instant-images-media-modal',
				INSTANT_IMAGES_URL . 'build/media-modal/index.js',
				$media_modal_asset_file['dependencies'],
				INSTANT_IMAGES_VERSION,
				true
			);

			wp_enqueue_style(
				'admin-instant-images',
				INSTANT_IMAGES_URL . 'build/style-instant-images.css',
				'',
				INSTANT_IMAGES_VERSION
			);

			$this::instant_img_localize( 'instant-images-media-modal' );
		}
	}

	/**
	 * Localization strings and settings
	 *
	 * @param string $script Script ID.
	 * @author ConnektMedia <support@connekthq.com>
	 * @since 2.0
	 */
	public static function instant_img_localize( $script = 'instant-images-react' ) {
		global $post;
		$settings = self::instant_img_get_settings();

		// Unsplash API.
		if ( defined( 'INSTANT_IMAGES_UNSPLASH_KEY' ) ) {
			$unsplash_api = INSTANT_IMAGES_UNSPLASH_KEY;
		} else {
			$unsplash_api = $settings->unsplash_api;
		}
		// Pixabay API.
		if ( defined( 'INSTANT_IMAGES_PIXABAY_KEY' ) ) {
			$pixabay_api = INSTANT_IMAGES_PIXABAY_KEY;
		} else {
			$pixabay_api = $settings->pixabay_api;
		}

		// Pexels API.
		if ( defined( 'INSTANT_IMAGES_PEXELS_KEY' ) ) {
			$pexels_api = INSTANT_IMAGES_PEXELS_KEY;
		} else {
			$pexels_api = $settings->pexels_api;
		}

		// Giphy API.
		if ( defined( 'INSTANT_IMAGES_GIPHY_KEY' ) ) {
			$giphy_api = INSTANT_IMAGES_GIPHY_KEY;
		} else {
			$giphy_api = $settings->giphy_api;
		}

		wp_localize_script(
			$script,
			'instant_img_localize',
			[
				'instant_images'          => __( 'Instant Images', 'instant-images' ),
				'version'                 => INSTANT_IMAGES_VERSION,
				'root'                    => esc_url_raw( rest_url() ),
				'nonce'                   => wp_create_nonce( 'wp_rest' ),
				'ajax_url'                => admin_url( 'admin-ajax.php' ),
				'admin_nonce'             => wp_create_nonce( 'instant_img_nonce' ),
				'lang'                    => function_exists( 'pll_current_language' ) ? pll_current_language() : '',
				'parent_id'               => $post ? $post->ID : 0,
				'auto_attribution'        => esc_html( $settings->auto_attribution ),
				'default_provider'        => esc_html( $settings->default_provider ),
				'download_width'          => esc_html( $settings->max_width ),
				'download_height'         => esc_html( $settings->max_height ),
				'query_debug'             => apply_filters( 'instant_images_query_debug', false ),
				'unsplash_app_id'         => $unsplash_api,
				'unsplash_url'            => 'https://unsplash.com',
				'unsplash_api_url'        => 'https://unsplash.com/developers',
				'unsplash_api_desc'       => __( 'Access to images from Unsplash requires a valid API key. API keys are available for free, just sign up for a Developer account at Unsplash, enter your API key below and you\'re good to go!', 'instant-images' ),
				'unsplash_content_filter' => apply_filters( 'instant_images_unsplash_content_filter', 'low' ),
				'pixabay_app_id'          => $pixabay_api,
				'pixabay_url'             => 'https://pixabay.com',
				'pixabay_api_url'         => 'https://pixabay.com/service/about/api/',
				'pixabay_api_desc'        => __( 'Access to images from Pixabay requires a valid API key. API keys are available for free, just sign up for an account at Pixabay, enter your API key below and you\'re good to go!', 'instant-images' ),
				'pixabay_safesearch'      => apply_filters( 'instant_images_pixabay_safesearch', true ),
				'pexels_app_id'           => $pexels_api,
				'pexels_url'              => 'https://pexels.com',
				'pexels_api_url'          => 'https://www.pexels.com/join-consumer/',
				'pexels_api_desc'         => __( 'Access to images from Pexels requires a valid API key. API keys are available for free, just sign up for an account at Pexels, enter your API key below and you\'re good to go!', 'instant-images' ),
				'giphy_app_id'            => $giphy_api,
				'giphy_url'               => 'https://giphy.com',
				'giphy_api_url'           => 'https://developers.giphy.com/',
				'giphy_api_desc'          => __( 'Access to gifs from Giphy requires a valid API key. API keys are available for free, just sign up for an account at Giphy and choose the "Select API" option when creating the key', 'instant-images' ),
				'openverse_url'           => 'https://openverse.org',
				'openverse_mature'        => apply_filters( 'instant_images_openverse_mature', false ),
				'error_upload'            => __( 'There was no response while attempting to the download image to your server. Check your server permission and max file upload size or try again', 'instant-images' ),
				'error_restapi'           => __( 'There was an error accessing the WP REST API.', 'instant-images' ),
				'error_restapi_desc'      => __( 'Instant Images requires access to the WP REST API via <u>POST</u> request to fetch and upload images to your media library.', 'instant-images' ),
				'attribution_hook'        => apply_filters( 'instant_images_attribution', false ),
				'view_all'                => __( 'View All Photos by', 'instant-images' ),
				'upload'                  => __( 'Click Image to Upload', 'instant-images' ),
				'upload_btn'              => __( 'Click to Upload', 'instant-images' ),
				'saving'                  => __( 'Downloading image...', 'instant-images' ),
				'resizing'                => __( 'Creating image sizes...', 'instant-images' ),
				'resizing_still'          => __( 'Still resizing...', 'instant-images' ),
				'no_results'              => __( 'Nothing matched your search query.', 'instant-images' ),
				'no_results_desc'         => __( 'Try adjusting your filter criteria or searching again.', 'instant-images' ),
				'new'                     => __( 'New', 'instant-images' ),
				'latest'                  => __( 'New', 'instant-images' ),
				'oldest'                  => __( 'Oldest', 'instant-images' ),
				'popular'                 => __( 'Popular', 'instant-images' ),
				'views'                   => __( 'Views', 'instant-images' ),
				'downloads'               => __( 'Downloads', 'instant-images' ),
				'search'                  => __( 'Search for Toronto + Coffee etc...', 'instant-images' ),
				'search_label'            => __( 'Search', 'instant-images' ),
				'search_results'          => __( 'image(s) found for', 'instant-images' ),
				'clear_search'            => __( 'Clear Search', 'instant-images' ),
				'open_external'           => __( 'View on', 'instant-images' ),
				'set_as_featured'         => __( 'Set as Featured Image', 'instant-images' ),
				'insert_into_post'        => __( 'Insert Into Post', 'instant-images' ),
				'edit_filename'           => __( 'Filename', 'instant-images' ),
				'edit_title'              => __( 'Title', 'instant-images' ),
				'edit_alt'                => __( 'Alt Text', 'instant-images' ),
				'edit_caption'            => __( 'Caption', 'instant-images' ),
				'edit_description'        => __( 'Description', 'instant-images' ),
				'edit_upload'             => __( 'Edit Attachment Details', 'instant-images' ),
				'edit_details'            => __( 'Edit Image Details', 'instant-images' ),
				'cancel'                  => __( 'Cancel', 'instant-images' ),
				'save'                    => __( 'Save', 'instant-images' ),
				'upload_now'              => __( 'Upload', 'instant-images' ),
				'attribution'             => __( 'Add Photo Attribution', 'instant-images' ),
				'btnCloseWindow'          => __( 'Close Window', 'instant-images' ),
				'btnClose'                => __( 'Close', 'instant-images' ),
				'btnVerify'               => __( 'Verify', 'instant-images' ),
				'enter_api_key'           => __( 'Enter API Key', 'instant-images' ),
				'api_key_invalid'         => __( 'The API Key is Invalid', 'instant-images' ),
				'api_success_msg'         => __( 'API key has been successfully validated!', 'instant-images' ),
				'api_invalid_msg'         => __( 'Invalid API key - enter a new API Key and try again.', 'instant-images' ),
				'api_invalid_403_msg'     => __( 'Missing API parameter - we are unable to complete the request at this time.', 'instant-images' ),
				'api_invalid_404_msg'     => __( 'The Instant Images Proxy is not configured for the requested provider.', 'instant-images' ),
				'api_invalid_500_msg'     => __( 'An internal server error has occured - please try again.', 'instant-images' ),
				'api_invalid_501_msg'     => __( 'No image provider or destination URL set.', 'instant-images' ),
				'api_ratelimit_msg'       => __( 'The API rate limit has been exceeded for this image provider. Please add a new API key or try again later.', 'instant-images' ),
				'api_default_provider'    => __( 'Switch the default provider in the Instant Images settings or check that you\'re using a valid API key.', 'instant-images' ),
				'get_api_key'             => __( 'Get API Key', 'instant-images' ),
				'use_instant_images_key'  => __( 'Reset Default Key', 'instant-images' ),
				'error_on_load_title'     => __( 'An unknown error has occured while accessing {provider}', 'instant-images' ),
				'error_on_load'           => __( 'Check your API keys are valid and the Default Provider set under the Instant Images settings panel.', 'instant-images' ),
				'error'                   => __( 'Error', 'instant-images' ),
				'ad'                      => __( 'Ad', 'instant-images' ),
				'advertisement'           => __( 'Advertisement', 'instant-images' ),
				'addons'                  => [
					'extended' => [
						'activated' => self::instant_images_addon_activated( 'extended' ),
						'license'   => self::instant_images_addon_valid_license( 'extended' ),
					],
				],
			]
		);
	}

	/**
	 * Show tab to upload image on post edit screens
	 *
	 * @param string $option WP Option.
	 * @return boolean
	 * @author ConnektMedia <support@connekthq.com>
	 * @since 3.2.1
	 */
	public static function instant_img_show_tab( $option ) {
		if ( ! $option ) {
			return true;
		}

		$options = get_option( INSTANT_IMAGES_SETTINGS );
		$show    = true;
		if ( isset( $options[ $option ] ) ) {
			if ( '1' === $options[ $option ] ) {
				$show = false;
			}
		}
		return $show;
	}

	/**
	 * Confirm user has access to instant images.
	 *
	 * @return boolean
	 * @author ConnektMedia <support@connekthq.com>
	 * @since 4.3.3
	 */
	public static function instant_img_has_access() {
		$access = false;
		if ( is_user_logged_in() && current_user_can( apply_filters( 'instant_images_user_role', 'upload_files' ) ) ) {
			$access = true;
		}
		return $access;
	}

	/**
	 * Confirm user has access to instant images settings.
	 *
	 * @return boolean
	 * @author ConnektMedia <support@connekthq.com>
	 * @since 6.1.1
	 */
	public static function instant_img_has_settings_access() {
		$access = false;
		if ( is_user_logged_in() && current_user_can( apply_filters( 'instant_images_settings_user_role', 'manage_options' ) ) ) {
			$access = true;
		}
		return $access;
	}

	/**
	 * Block Instant Images from loading on some screens.
	 *
	 * @param array $screens An array of screen IDs.
	 * @return boolean
	 * @author ConnektMedia <support@connekthq.com>
	 * @since 4.4.0.3
	 */
	public static function instant_img_not_current_screen( $screens = [] ) {
		$access       = true;
		$admin_screen = get_current_screen();
		if ( $admin_screen && in_array( $admin_screen->id, $screens, true ) ) {
			$access = false;
		}
		return $access;
	}

	/**
	 * Get the instant images tagline.
	 *
	 * @return string
	 */
	public static function instant_images_get_tagline() {
		// translators: Instant Images tagline.
		$instant_images_tagline = __( 'One-click photo uploads from %1$s, %2$s, %3$s, %4$s, and %5$s.', 'instant-images' ); // phpcs:ignore
		return '<span class="instant-images-tagline">' . sprintf( $instant_images_tagline, '<a href="https://unsplash.com/" target="_blank">Unsplash</a>', '<a href="https://wordpress.org/openverse" target="_blank">Openverse</a>', '<a href="https://pixabay.com/" target="_blank">Pixabay</a>', '<a href="https://pexels.com/" target="_blank">Pexels</a>', '<a href="https://giphy.com/" target="_blank">Giphy</a>' ) .'</span>';  // phpcs:ignore
	}

	/**
	 * Add custom links to plugins.php
	 *
	 * @param array $links Current links.
	 * @return array
	 * @author ConnektMedia <support@connekthq.com>
	 * @since 2.0
	 */
	public function add_action_links( $links ) {
		$mylinks = [
			'<a href="' . INSTANT_IMAGES_WPADMIN_URL . '">' . __( 'Get Images', 'instant-images' ) . '</a>',
			'<a href="' . INSTANT_IMAGES_ADDONS_URL . '" target="_blank">' . __( 'Browse Add-ons', 'instant-images' ) . '</a>',
			'<a href="' . INSTANT_IMAGES_WPADMIN_SETTINGS_URL . '">' . __( 'Settings', 'instant-images' ) . '</a>'
		];
		return array_merge( $mylinks, $links );
	}

	/**
	 * Is Instant Images add-on installed and activated.
	 *
	 * @param string $addon Add-on name.
	 * @return boolean
	 */
	public static function instant_images_addon_activated( $addon ) {
		switch ( $addon ) {
			case 'extended':
				return class_exists( 'InstantImagesExtended' );
		}
	}

	/**
	 * Is Instant Images add-on installed and activated with a valid license key.
	 *
	 * @param string $addon Add-on name.
	 * @return boolean
	 */
	public static function instant_images_addon_valid_license( $addon ) {
		switch ( $addon ) {
			case 'extended':
				return class_exists( 'InstantImagesExtended' ) && InstantImagesExtended::valid_license();
		}
	}

	/**
	 * Get all image sizes.
	 *
	 * @return array An array of image sizes.
	 */
	public static function instant_images_get_image_sizes() {
		global $_wp_additional_image_sizes;
		$default_image_sizes = get_intermediate_image_sizes();
		foreach ( $default_image_sizes as $size ) {
			$image_sizes[ $size ][ 'width' ] = intval( get_option( "{$size}_size_w" ) );
			$image_sizes[ $size ][ 'height' ] = intval( get_option( "{$size}_size_h" ) );
			$image_sizes[ $size ][ 'crop' ] = get_option( "{$size}_crop" ) ? get_option( "{$size}_crop" ) : false;
		}

		if ( isset( $_wp_additional_image_sizes ) && count( $_wp_additional_image_sizes ) ) {
			$image_sizes = array_merge( $image_sizes, $_wp_additional_image_sizes );
		}
		if ( ! $image_sizes ) {
			return [];
		}

		$sizes = [];
		foreach( $image_sizes as $key => $image_size ) {
			$label  = str_replace( '_' , ' ' , $key );
			$label  = str_replace( '-' , ' ' , $label );
			$height = $image_size[ 'height' ] === 0 ? '--' :  $image_size[ 'height' ]; // If height is empty or 0.

			$sizes[ $key ] = [
				'label'  => ucwords( $label ),
				'width'  => $image_size[ 'width' ],
				'height' => $height,
				'crop'   => $image_size[ 'crop' ]
			];
		}
		return $sizes;
	}

	/**
	 * Display image sizes in a table.
	 *
	 * @return void
	 */
	public static function instant_images_display_image_sizes() {
		$sizes = self::instant_images_get_image_sizes();
		if ( ! $sizes ) {
			return;
		}
		ob_start();
		?>
		<table class="instant-images-image-size-table">
			<tr>
				<th><?php esc_attr_e( 'Label', 'instant-images' ); ?></th>
				<th><?php esc_attr_e( 'Name', 'instant-images' ); ?></th>
				<th><?php esc_attr_e( 'Width', 'instant-images' ); ?></th>
				<th><?php esc_attr_e( 'Height', 'instant-images' ); ?></th>
				<th><?php esc_attr_e( 'Crop', 'instant-images' ); ?></th>
			</tr>
		<?php
		foreach( $sizes as $key => $size ) {
			$crop = $size[ 'crop' ];
			$crop = $crop ? 'Yes' : 'No';
			echo '<tr';
			do_action( 'instant_images_image_size_tr_class', $key );
			echo '>';
			echo '<td>';
			echo '<span>';
			do_action( 'instant_images_image_size_before', $key );
			echo '<strong>' . $size[ 'label' ] . '</strong>';
			do_action( 'instant_images_image_size_after', $key );
			echo '</span>';
			echo '</td>';
			echo '<td><pre>' . $key . '</pre></td>';
			echo '<td>' . $size[ 'width' ] . '</td>';
			echo '<td>' . $size[ 'height' ] . '</td>';
			echo '<td>' . $crop . '</td>';
			echo '</tr>';
		}
		?>
		</table>
		<?php
		return ob_get_clean();
	}
}

/**
 * The main function responsible for returning the one true InstantImages Instance.
 *
 * @author ConnektMedia <support@connekthq.com>
 * @since 2.0
 */
function instant_images() {
	global $instant_images;
	if ( ! isset( $instant_images ) ) {
		$instant_images = new InstantImages();
	}
	return $instant_images;
}

instant_images(); // initialize.
