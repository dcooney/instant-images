<?php
/**
 * Image Sizes template.
 *
 * @package InstantImages
 */

$extended_active = InstantImages::instant_images_addon_valid_license( 'extended' ) && defined( 'INSTANT_IMAGES_EXTENDED_PATH' );
$extended_url    = INSTANT_IMAGES_ADDONS_URL . 'extended/?utm_source=WPAdmin&utm_medium=InstantImages&utm_campaign=image-sizes'
?>
<section class="settings-entry" id="image-sizes">
	<div class="settings-entry--title">
		<i class="fa fa-file-image-o" aria-hidden="true"></i>
		<h2><?php esc_attr_e( 'Image Sizes', 'instant-images' ); ?></h2>
		<p><?php esc_attr_e( 'Create, manage, and view your active WordPress image sizes.', 'instant-images' ); ?></p>
	</div>
	<div class="settings-entry--action instant-images-extended-image-sizes">
		<!-- Add Sizes -->
		<div class="instant-images-extended-image-sizes--add<?php echo ! $extended_active ? ' not-installed' : ''; ?>">
			<h3><?php esc_attr_e( 'Add Image Size', 'instant-images' ); ?></h3>
			<p><?php esc_attr_e( 'Enter a name, width, and height for your custom image size.', 'instant-images' ); ?></p>
			<?php if ( ! $extended_active ) { ?>
			<form>
				<div class="instant-images-callout-cta">
					<div>
						<p>
						<?php
						// translators: Add-on URL.
						echo sprintf ( __( 'Adding custom image sizes is available with the %1$s<strong>Extended add-on</strong>%2$s.', 'instant-images' ), '<a href="' . $extended_url . '" target="_blank">', '</a>' ); ?>
						</p>
						<p>
							<a class="button button-primary" href="<?php echo esc_url( $extended_url ); ?>" target="_blank">
								<?php esc_attr_e( 'Upgrade Now', 'instant-images' ); ?>
							</a>
						</p>
					</div>
				</div>
				<div class="instant-images-extended-image-sizes--elements">
					<div>
						<label for="instant-images-image-size-name"><?php _e( 'Name', 'instant-images' ); ?></label>
						<input type="text" id="instant-images-image-size-name">
					</div>
					<div>
						<label for="instant-images-image-size-width"><?php _e( 'Width (px)', 'instant-images' ); ?></label>
						<input type="number" min="0" id="instant-images-image-size-width" value="1600">
					</div>
					<div>
						<label for="instant-images-image-size-height"><?php _e( 'Height (px)', 'instant-images' ); ?></label>
						<input type="number" min="0" id="instant-images-image-size-height" value="900">
					</div>
					<div>
						<label for="instant-images-image-size-crop"><?php _e( 'Crop', 'instant-images' ); ?></label>
						<select id="instant-images-image-size-crop">
							<option value="0"><?php _e( 'No', 'instant-images' ); ?></option>
							<option value="1"><?php _e( 'Yes', 'instant-images' ); ?></option>
						</select>
					</div>
				</div>
				<div class="instant-images-extended-image-sizes--controls">
					<button class="button button-primary" id="instant-images-add-image-size"<?php echo !$extended_active ? ' disabled' : ''; ?>>
						<?php esc_attr_e( 'Add Image Size', 'instant-images' ); ?>
					</button>
				</div>
			</form>
			<?php } else { ?>
				<div id="instant-images-extended-image-sizes--app"></div>
			<?php } ?>
		</div>

		<!-- Current Sizes -->
		<div class="instant-images-extended-image-sizes--current-sizes">
			<h3><?php esc_attr_e( 'Current Image Sizes', 'instant-images' ); ?></h3>
			<p><?php esc_attr_e( 'Image sizes listed below are currently enabled on your site.', 'instant-images' ); ?></p>
			<div>
				<div class="scroll-section scroll-section--small" id="instant-images-image-sizes">
					<?php echo InstantImages::instant_images_display_image_sizes(); ?>
				</div>
			</div>
		</div>
	</div>
</section>
