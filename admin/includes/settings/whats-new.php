<?php
/**
 * Latest news template.
 *
 * @package InstantImages
 */

?>
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
						<strong>Extended Add-on</strong>
						Meet our first add-on to enhance the Instant Images experience with added features and functionality.
					<br/>&rarr; <a href="https://getinstantimages.com/add-ons/extended/" target="_blank">Get Extended</a></p>
				</li>
				<li>
					<p>
						<strong>Website Refresh</strong>
						We put a fresh coat of paint on the <a href="https://getinstantimages.com" target="_blank">Instant Images website</a>!
					</p>
				</li>
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
