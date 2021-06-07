<?php
/**
 * Instant Images page settings.
 *
 * @package InstantImages
 */

?>
<section class="instant-images-settings">
	<div class="cnkt-sidebar">
	<section class="cta ii-settings">
		<h2><?php esc_attr_e( 'Global Settings', 'instant-images' ); ?></h2>
		<p><?php esc_attr_e( 'Manage your media upload settings', 'instant-images' ); ?>.</p>
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
		<div class="spacer sm"></div>
		<h2 class="w-border"><?php esc_attr_e( 'What\'s New', 'instant-images' ); ?></h2>
		<p><?php esc_attr_e( 'The latest Instant Images updates', 'instant-images' ); ?>.</p>
		<div class="cta-wrap">
			<ul class="whats-new">
				<li><strong>Improved Download Speeds</strong>: Instant Images <em>v+</em> is now up to 4x faster than previous versions after a critical update in the initial image fetching process.</li>
				<li><strong>Media Modals</strong>: Instant Images tab added to all WordPress Media Modal windows.</li>
				<li><strong>Gutenberg Support</strong>: Instant Images directly integrates with Gutenberg as a plugin sidebar.</li>
				<li><strong>User Roles</strong>: Added <em>instant_images_user_role</em> filter to allow for control over user capability.</li>
				<li><strong>Image Search</strong>: Added support for searching individual photos by Unsplash ID - searching <pre>id:{photo_id}</pre> will return a single result.<br/>e.g. <pre>id:YiUi00uqKk8</pre></li>
			</ul>
		</div>
	</section>

		<?php
		$instant_images_plugin_array = array(
			array(
				'slug' => 'ajax-load-more',
			),
			array(
				'slug' => 'easy-query',
			),
			array(
				'slug' => 'block-manager',
			),
			array(
				'slug' => 'velocity',
			),
		);
		?>
		<section class="cta ii-plugins">
			<h2><?php esc_attr_e( 'Our Plugins', 'instant-images' ); ?></h2>
			<p><strong>Instant Images</strong> is made with <span style="color: #e25555;">♥</span> by <a target="blank" href="https://connekthq.com/?utm_source=WPAdmin&utm_medium=InstantImages&utm_campaign=OurPlugins">Connekt</a></p>
			<div class="cta-wrap">
				<?php
				if ( class_exists( 'Connekt_Plugin_Installer' ) ) {
					Connekt_Plugin_Installer::init( $instant_images_plugin_array );
				}
				?>
			</div>
		</section>

	</div>

</section>
