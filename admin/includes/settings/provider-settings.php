<?php
/**
 * Provider settings template.
 *
 * @package InstantImages
 */

$all_providers    = InstantImages::instant_img_get_providers();
$active_providers = InstantImages::instant_img_get_active_providers();
$all_slugs        = array_map( function( $p ) { return $p['slug']; }, $all_providers );

// Build ordered list: active providers first (in order), then inactive ones.
$ordered_providers = [];
foreach ( $active_providers as $slug ) {
	foreach ( $all_providers as $provider ) {
		if ( $provider['slug'] === $slug ) {
			$provider['active'] = true;
			$ordered_providers[] = $provider;
			break;
		}
	}
}
foreach ( $all_providers as $provider ) {
	if ( ! in_array( $provider['slug'], $active_providers, true ) ) {
		$provider['active']  = false;
		$ordered_providers[] = $provider;
	}
}
?>
<section class="settings-entry" id="provider-settings">
	<div class="settings-entry--title">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
			<path d="M96 96c0-35.3 28.7-64 64-64l320 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64l-320 0c-35.3 0-64-28.7-64-64L96 96zM24 128c13.3 0 24 10.7 24 24l0 296c0 8.8 7.2 16 16 16l360 0c13.3 0 24 10.7 24 24s-10.7 24-24 24L64 512c-35.3 0-64-28.7-64-64L0 152c0-13.3 10.7-24 24-24zm168 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm196.5 11.5c-4.4-7.1-12.1-11.5-20.5-11.5s-16.1 4.4-20.5 11.5l-56.3 92.1-24.5-30.6c-4.6-5.7-11.4-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4S174.8 352 184 352l272 0c8.7 0 16.7-4.7 20.9-12.3s4.1-16.8-.5-24.3l-88-144z"/>
		</svg>
		<h2><?php esc_attr_e( 'Providers', 'instant-images' ); ?></h2>
		<p><?php esc_attr_e( 'Enable, disable, and reorder your image providers.', 'instant-images' ); ?></p>
	</div>
	<div class="settings-entry--action provider-settings">
		<form action="options.php" method="post" class="settings" id="provider-settings-form">
			<?php settings_fields( 'instant_images_provider_settings_group' ); ?>
			<input type="hidden" id="instant_img_provider_config" name="instant_img_provider_config" value="" />
			<div id="provider-sortable-list" class="provider-sortable-list">
				<?php foreach ( $ordered_providers as $provider ) : ?>
					<div
						class="provider-sortable-item<?php echo $provider['active'] ? ' active' : ' inactive'; ?>"
						data-slug="<?php echo esc_attr( $provider['slug'] ); ?>"
						draggable="true"
					>
						<span class="provider-sortable-item--handle" title="<?php esc_attr_e( 'Drag to reorder', 'instant-images' ); ?>">
							<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
								<circle cx="5" cy="3" r="1.5"/>
								<circle cx="11" cy="3" r="1.5"/>
								<circle cx="5" cy="8" r="1.5"/>
								<circle cx="11" cy="8" r="1.5"/>
								<circle cx="5" cy="13" r="1.5"/>
								<circle cx="11" cy="13" r="1.5"/>
							</svg>
						</span>
						<span class="provider-sortable-item--name">
							<?php echo esc_html( $provider['name'] ); ?>
						</span>
						<label class="instant-images-checkbox" title="<?php esc_attr_e( 'Enable/Disable Provider', 'instant-images' ); ?>">
							<input
								type="checkbox"
								<?php checked( $provider['active'] ); ?>
								data-slug="<?php echo esc_attr( $provider['slug'] ); ?>"
							/>
							<div class="instant-images-checkbox--switch">
								<div class="toggle-switch"></div>
							</div>
						</label>
					</div>
				<?php endforeach; ?>
			</div>
			<div class="save-settings">
			<?php submit_button( __( 'Save Settings', 'instant-images' ) ); ?>
			<button type="button" class="button" id="provider-reset-btn">
				<?php esc_attr_e( 'Reset', 'instant-images' ); ?>
			</button>
			<div class="loading"></div>
			<div class="saved">
				<i class="fa fa-check-circle-o" aria-hidden="true"></i>
				<?php esc_attr_e( 'Settings Saved', 'instant-images' ); ?>
			</div>
			<div class="clear"></div>
		</div>
		</form>
	</div>
</section>
<script>
(function() {
	const list = document.getElementById('provider-sortable-list');
	const hiddenInput = document.getElementById('instant_img_provider_config');
	const defaultOrder = <?php echo wp_json_encode( $all_slugs ); ?>;
	let dragItem = null;

	function updateHiddenInput() {
		const items = list.querySelectorAll('.provider-sortable-item');
		const active = [];
		items.forEach(function(item) {
			const checkbox = item.querySelector('input[type="checkbox"]');
			if (checkbox && checkbox.checked) {
				active.push(item.getAttribute('data-slug'));
			}
		});

		// Prevent deactivating all providers.
		if (active.length === 0) {
			const firstCheckbox = list.querySelector('.provider-sortable-item input[type="checkbox"]');
			if (firstCheckbox) {
				firstCheckbox.checked = true;
				const firstItem = firstCheckbox.closest('.provider-sortable-item');
				firstItem.classList.remove('inactive');
				firstItem.classList.add('active');
				active.push(firstItem.getAttribute('data-slug'));
			}
		}

		hiddenInput.value = JSON.stringify(active);
	}

	// Toggle handler.
	list.addEventListener('change', function(e) {
		if (e.target.type === 'checkbox') {
			const item = e.target.closest('.provider-sortable-item');
			if (e.target.checked) {
				item.classList.remove('inactive');
				item.classList.add('active');
			} else {
				item.classList.remove('active');
				item.classList.add('inactive');
			}
			updateHiddenInput();
		}
	});

	// Drag and drop.
	list.addEventListener('dragstart', function(e) {
		dragItem = e.target.closest('.provider-sortable-item');
		if (dragItem) {
			dragItem.classList.add('dragging');
			e.dataTransfer.effectAllowed = 'move';
		}
	});

	list.addEventListener('dragend', function() {
		if (dragItem) {
			dragItem.classList.remove('dragging');
			dragItem = null;
			updateHiddenInput();
		}
	});

	list.addEventListener('dragover', function(e) {
		e.preventDefault();
		e.dataTransfer.dropEffect = 'move';
		const target = e.target.closest('.provider-sortable-item');
		if (target && target !== dragItem) {
			const rect = target.getBoundingClientRect();
			const midY = rect.top + rect.height / 2;
			if (e.clientY < midY) {
				list.insertBefore(dragItem, target);
			} else {
				list.insertBefore(dragItem, target.nextSibling);
			}
		}
	});

	// Reset button handler.
	document.getElementById('provider-reset-btn').addEventListener('click', function() {
		// Reorder items to default order and enable all.
		defaultOrder.forEach(function(slug) {
			const item = list.querySelector('[data-slug="' + slug + '"]');
			if (item) {
				const checkbox = item.querySelector('input[type="checkbox"]');
				checkbox.checked = true;
				item.classList.remove('inactive');
				item.classList.add('active');
				list.appendChild(item);
			}
		});
		updateHiddenInput();

		const self = this;
		// Trigger form submission after a short delay to allow UI to update.
		setTimeout(function() {
			const parent = self.parentNode;
			parent.querySelector("#submit").click();
		}, 250);
	});

	// Initialize hidden input on page load.
	updateHiddenInput();
})();
</script>
