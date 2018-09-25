<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
?>
    
<?php if($show_settings){ ?>  
<header class="header-wrap">
   <h1>
      <?php echo INSTANT_IMG_TITLE; ?>
      <span>
      <?php 
			$tagline = __('One click photo uploads from %s', 'instant-images');
			echo sprintf($tagline, '<a href="https://unsplash.com/" target="_blank">unsplash.com</a>');
		?>
   </h1>
   <button type="button" class="button button-secondary button-large">
   	<i class="fa fa-cog" aria-hidden="true"></i> <?php _e('Settings', 'instant-images'); ?>
   </button>
</header>   
<?php } ?>
<?php include( INSTANT_IMG_PATH . 'admin/includes/cta/permissions.php');	?>
<?php 
	if($show_settings){
		include( INSTANT_IMG_PATH . 'admin/includes/unsplash-settings.php');	
	}
?>   
<section class="instant-images-wrapper">
   <div class="cnkt-main">	   
		<div id="app"></div>
   </div>
</section>