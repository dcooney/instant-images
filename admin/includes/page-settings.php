<?php
/**
 * Instant Images page settings.
 *
 * @package InstantImages
 */

?>
<section class="instant-images-settings">
	<div class="cnkt-sidebar">
		<section class="cta ii-whats-new">
			<h2><?php esc_attr_e( 'What\'s New', 'instant-images' ); ?></h2>
			<p><?php esc_attr_e( 'The latest Instant Images updates.', 'instant-images' ); ?></p>
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
			<section class="with-love">
				<p><strong>Instant Images</strong> is made with <span style="color: #e25555;">♥</span> by <a target="blank" href="https://connekthq.com/?utm_source=WPAdmin&utm_medium=InstantImages&utm_campaign=OurPlugins">Connekt</a></p>
			</section>
		</section>
		<section class="cta ii-settings">
			<h2><?php esc_attr_e( 'Global Settings', 'instant-images' ); ?></h2>
			<p><?php esc_attr_e( 'Manage your media upload settings.', 'instant-images' ); ?></p>
			<div class="cta-wrap">
				<form action="options.php" method="post" id="unsplash-form-options">
					<?php
						settings_fields( 'instant-img-setting-group' );
						do_settings_sections( 'instant-images' );
						// @codingStandardsIgnoreStart
						$options = get_option( 'instant_img_settings' ); // Get the older values, wont work the first time.
						// @codingStandardsIgnoreEnd
					?>
					<div class="save-settings">
						<?php submit_button( __( 'Save Settings', 'instant-images' ) ); ?>
						<div class="loading"></div>
						<div class="clear"></div>
					</div>
				</form>
			</div>
		</section>
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
		<section class="cta ii-plugins">
			<h2><?php esc_attr_e( 'Our Plugins', 'instant-images' ); ?></h2>
			<p><?php esc_attr_e( 'Check out some of our other WordPress plugins.', 'instant-images' ); ?></p>
			<?php
			if ( class_exists( 'Connekt_Plugin_Installer' ) ) {
				Connekt_Plugin_Installer::init( $instant_images_plugin_array );
			}
			?>
		</section>

	</div>
</section>
