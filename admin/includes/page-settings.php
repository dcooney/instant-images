<?php
/**
 * Instant Images page settings.
 *
 * @package InstantImages
 */

?>

<section class="instant-images-settings instant-img-container">

	<div class="instant-images-settings--grid">

		<div class="instant-images-settings--header">
			<div class="header-wrap-alt">
				<h1>
					<?php echo esc_attr( INSTANT_IMAGES_TITLE ); ?>
					<?php echo wp_kses_post( InstantImages::instant_images_get_tagline() ); ?>
				</h1>
				<p>
					<a href="<?php echo esc_url( INSTANT_IMAGES_WPADMIN_URL ); ?>" class="button button-secondary button-large">
						<?php esc_attr_e( 'Get Images', 'instant-images' ); ?>
					</a>
				</p>
			</div>
			<form class="settings-jump">
				<label for="anchor-nav">Jump to Section</label>
				<select id="anchor-nav">
					<option value="">--<?php esc_attr_e( 'Make a Selection', 'instant-images' ); ?>--</option>
					<?php if ( class_exists( 'InstantImagesPro' ) ) { ?>
						<option value="pro-settings"><?php esc_attr_e( 'Pro Settings', 'instant-images' ); ?></option>
					<?php } ?>
					<option value="general-settings"><?php esc_attr_e( 'General Settings', 'instant-images' ); ?></option>
					<option value="api-settings"><?php esc_attr_e( 'API Keys', 'instant-images' ); ?></option>
					<option value="whats-new"><?php esc_attr_e( 'What\'s New', 'instant-images' ); ?></option>
					<option value="our-plugins"><?php esc_attr_e( 'Our Plugins', 'instant-images' ); ?></option>
				</select>
			</form>
			<nav>
				<?php if ( class_exists( 'InstantImagesPro' ) ) { ?>
					<button type="button" data-anchor="pro-settings"><?php esc_attr_e( 'Pro Settings', 'instant-images' ); ?></button>
				<?php } ?>
				<button type="button" data-anchor="general-settings"><?php esc_attr_e( 'General Settings', 'instant-images' ); ?></button>
				<button type="button" data-anchor="api-settings"><?php esc_attr_e( 'API Keys', 'instant-images' ); ?></button>
				<button type="button" data-anchor="whats-new"><?php esc_attr_e( 'What\'s New', 'instant-images' ); ?></button>
				<button type="button" data-anchor="our-plugins"><?php esc_attr_e( 'Our Plugins', 'instant-images' ); ?></button>
			</nav>
		</div>

		<div class="instant-images-settings--sections">
			<!-- Pro -->
			<?php if ( class_exists( 'InstantImagesPro' ) ) { ?>
				<section class="settings-entry" id="pro-settings" style="display: none;">
				<div class="settings-entry--title">
					<i class="fa fa-star" aria-hidden="true"></i>
					<h2><?php esc_attr_e( 'Instant Images Pro', 'instant-images' ); ?></h2>
					<p><?php esc_attr_e( 'Manage settings for the Pro add-on.', 'instant-images' ); ?></p>
				</div>
				<div class="settings-entry--action general-settings">
					<form action="options.php" method="post">
						<?php
							// TODO: Add pro settings.
							// settings_fields( 'instant_images_general_settings_group' );
							// do_settings_sections( 'instant-images' );.
						?>
						<?php require INSTANT_IMAGES_PATH . 'admin/includes/save-settings.php'; ?>
					</form>
				</div>
			</section>
			<?php } ?>

			<!-- General Settings -->
			<section class="settings-entry" id="general-settings">
				<div class="settings-entry--title">
					<i class="fa fa-cog" aria-hidden="true"></i>
					<h2><?php esc_attr_e( 'General Settings', 'instant-images' ); ?></h2>
					<p><?php esc_attr_e( 'Manage your Instant Images plugin settings.', 'instant-images' ); ?></p>
				</div>
				<div class="settings-entry--action general-settings">
					<form action="options.php" method="post">
						<?php
							settings_fields( 'instant_images_general_settings_group' );
							do_settings_sections( 'instant-images' );
						?>
						<?php require INSTANT_IMAGES_PATH . 'admin/includes/save-settings.php'; ?>
					</form>
				</div>
			</section>

			<!-- API Settings -->
			<section class="settings-entry" id="api-settings">
				<div class="settings-entry--title">
					<i class="fa fa-key" aria-hidden="true"></i>
					<h2><?php esc_attr_e( 'API Keys', 'instant-images' ); ?></h2>
					<p><?php esc_attr_e( 'Replace the default Instant Images API keys with your own.', 'instant-images' ); ?></p>
					<p class="small"><?php esc_attr_e( 'Leave empty to restore default plugin keys.', 'instant-images' ); ?></p>
				</div>
				<div class="settings-entry--action general-settings">
					<form action="options.php" method="post">
						<?php
							settings_fields( 'instant_images_api_settings_group' );
							do_settings_sections( 'instant-images-api' );
						?>
						<?php require INSTANT_IMAGES_PATH . 'admin/includes/save-settings.php'; ?>
					</form>
				</div>
			</section>

			<!-- What's New -->
			<section class="settings-entry" id="whats-new">
				<div class="settings-entry--title">
					<i class="fa fa-pencil" aria-hidden="true"></i>
					<h2><?php esc_attr_e( 'What\'s New', 'instant-images' ); ?></h2>
					<p><?php esc_attr_e( 'The latest Instant Images news, features and updates.', 'instant-images' ); ?></p>
				</div>
				<div class="settings-entry--action whats-new">
					<div class="scroll-section">
						<ul>
							<li>
								<p>
									<strong>Openverse</strong>
									We've added support for <a href="https://wordpress.org/openverse/" target="_blank">Openverse</a> image API.
								</p>
							</li>
							<li>
								<p>
									<strong>Proxy Server</strong>
									All API requests to Unsplash, Pexels and Pixabay are now routed through our custom proxy server at <a href="https://proxy.getinstantimages.com" target="_blank">proxy.getinstantimages.com</a>.
								</p>
							</li>
							<li>
								<p>
									<strong>Privacy and Terms</strong>
									Please take a moment and read our updated <a href="https://connekthq.com/plugins/instant-images/privacy-policy/" target="_blank">Privacy Policy</a> and <a href="https://connekthq.com/plugins/instant-images/terms-of-use/" target="_blank">Terms of Use</a>.
								</p>
							</li>
							<li>
								<p>
									<strong>Image ID Search</strong>
									Added support for searching individual photos by image ID - searching <code>id:{photo_id}</code> will return a single result.<br/><br/>e.g. <code>id:YiUi00uqKk8</code>
								</p>
							</li>
							<li>
								<p>
									<strong>Pixabay & Pexels</strong>
									We've added support for <a href="https://pixabay.com/" target="_blank">Pixabay</a> and <a href="https://pexels.com/" target="_blank">Pexels</a> image APIs.
								</p>
							</li>
							<li>
								<p>
									<strong>Improved Download Speeds</strong>
									Instant Images is now up to 4x faster than previous versions after a critical update in the initial image fetching process.
								</p>
							</li>
							<li>
								<p>
									<strong>Media Modals</strong>
									Instant Images tab added to all WordPress Media Modals allowing access to Instant Images for anywhere media can be insterted.
								</p>
							</li>
							<li>
								<p>
									<strong>Gutenberg Support</strong>
									Instant Images now integrates directly into Gutenberg as a plugin sidebar.
								</p>
							</li>
							<li>
								<p>
									<strong>User Roles</strong>
									Added the <code>instant_images_user_role</code> filter hook to allow for complete control over user capabilities.
								</p>
							</li>
						</ul>
					</div>
				</div>
			</section>

			<!-- Our Plugins -->
			<section class="settings-entry" id="our-plugins">
				<div class="settings-entry--title">
					<i class="fa fa-plug" aria-hidden="true"></i>
					<h2><?php esc_attr_e( 'Our Plugins', 'instant-images' ); ?></h2>
					<p><?php esc_attr_e( 'Check out some of our other WordPress plugins.', 'instant-images' ); ?></p>
				</div>
				<div class="settings-entry--action other-plugins">
					<?php
					$instant_images_plugin_array = array(
						array(
							'slug' => 'ajax-load-more',
						),
						array(
							'slug' => 'block-manager',
						),
						array(
							'slug' => 'easy-query',
						),
						array(
							'slug' => 'velocity',
						),
					);
					?>
					<?php
					if ( class_exists( 'Connekt_Plugin_Installer' ) ) {
						Connekt_Plugin_Installer::init( $instant_images_plugin_array );
					}
					?>
				</div>
			</section>

		</div>
	</div>
</div>
