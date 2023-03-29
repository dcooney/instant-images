<?php
/**
 * Instant Images Unsplash page layout.
 *
 * @package InstantImages
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
?>

<?php
if ( $show_settings ) {
	require_once INSTANT_IMAGES_PATH . 'admin/includes/header.php';
}
?>
<section class="instant-images-wrapper">
	<div id="app"></div>
</section>
