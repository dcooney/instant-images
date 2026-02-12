<?php
/**
 * Latest news template.
 *
 * @package InstantImages
 */

?>
<section class="settings-entry" id="whats-new">
	<div class="settings-entry--title">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
			<path d="M36.4 353.2c4.1-14.6 11.8-27.9 22.6-38.7l181.2-181.2 33.9-33.9c16.6 16.6 51.3 51.3 104 104l33.9 33.9-33.9 33.9-181.2 181.2c-10.7 10.7-24.1 18.5-38.7 22.6L30.4 510.6c-8.3 2.3-17.3 0-23.4-6.2S-1.4 489.3 .9 481L36.4 353.2zm55.6-3.7c-4.4 4.7-7.6 10.4-9.3 16.6l-24.1 86.9 86.9-24.1c6.4-1.8 12.2-5.1 17-9.7L91.9 349.5zm354-146.1c-16.6-16.6-51.3-51.3-104-104L308 65.5C334.5 39 349.4 24.1 352.9 20.6 366.4 7 384.8-.6 404-.6S441.6 7 455.1 20.6l35.7 35.7C504.4 69.9 512 88.3 512 107.4s-7.6 37.6-21.2 51.1c-3.5 3.5-18.4 18.4-44.9 44.9z"/>
		</svg>
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
