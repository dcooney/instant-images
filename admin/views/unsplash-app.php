<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
?>
<?php 
   $unsplash_api_count = get_option('unsplash_api_count');
   $warning = get_option('unsplash_api_warning');
   $app_id = instant_img_get_app_id();
   
   // Is the APP ID unique? If so, we don't need to display API warnings.
   $unique_app_id = false;
   if($app_id !== INSTANT_IMG_DEFAULT_APP_ID){
      $unique_app_id = true;
   }   
?>

<div class="unsplashwp-search">
   <form id="photo-search">
		<div class="field-wrap">
			<label for="unsplashwp-search" class="offscreen"><?php _e('Enter Search term', 'instant-images'); ?></label>
			<input type="search" id="unsplashwp-search" value="" placeholder="<?php _e('Search for Toronto, Computers, Coffee + Breakfast etc...', 'instant-images'); ?>">
			<button type="submit" id="unsplashwp-search-submit"><i class="fa fa-search"></i><span class="offscreen"><?php _e('Search', 'instant-images'); ?></span></button>
			<a class="clear-results" href="#"><i class="fa fa-times"></i></a>
		</div>
		<div class="options">
   		<div class="drop-options btn">
      		<a href="#"><i class="fa fa-cog"></i><span><?php _e('Options', 'instant-images'); ?></span></a>
      		<div class="dropdown">
         		<h4><?php _e('Order by:', 'instant-images'); ?></h4> 
         		<ul id="unsplash-order">
            		<li><a href="#" data-id="latest"><span></span> <?php _e('Newest', 'instant-images'); ?></a></li>
            		<li><a href="#" data-id="oldest"><span></span> <?php _e('Oldest', 'instant-images'); ?></a></li>
            		<li><a href="#" data-id="popular"><span></span> <?php _e('Most Popular', 'instant-images'); ?></a></li>
         		</ul>
         		<div class="form-msg">
            		<strong><?php _e('Note', 'instant-images'); ?>:</strong> <?php _e('Ordering is not supported with Unsplash search.', 'instant-images'); ?>
         		</div>
      		</div>
   		</div>
		</div>
   </form>
</div>

<?php 
   // API Usage Msg
   $showing_warning = false;
   if($unsplash_api_count > round(INSTANT_IMG_WARNING)  && $warning !== 'true' && !$unique_app_id){
      $showing_warning = true;   
      include( INSTANT_IMG_PATH . 'admin/includes/warning.php');   
   } 
?>   

<div id="initialize">
	<div class="init-content-wrap">
   	<h2><?php _e('Search Unsplash', 'instant-images'); ?></h2>
   	<p><?php _e('Enter a search term above to begin searching images from <a href="https://unsplash.com" target="_blank">unsplash.com</a>. You can search for single terms or join terms using the [<i>+</i>] symbol.', 'instant-images'); ?><span><i>e.g. <a href="#" id="fake-search">coffee + woman</a></i></span></p>
   	<div class="spacerrr"></div>
   	<div class="init-options">
      	<h3><strong><?php _e('Not sure what to search for', 'instant-images'); ?>?</strong><?php _e('You can browse Unsplash photos using the options below', 'instant-images'); ?>.</h3>
   	   <button type="button" class="button" data-id="latest"><i class="fa fa-bolt"></i>&nbsp; <?php _e('Newest', 'instant-images'); ?></button>
   	   <button type="button" class="button" data-id="oldest"><i class="fa fa-calendar"></i>&nbsp; <?php _e('Oldest', 'instant-images'); ?></button>
   	   <button type="button" class="button" data-id="popular"><i class="fa fa-heart"></i>&nbsp; <?php _e('Most Popular', 'instant-images'); ?></button>
   	</div>
	</div>
	<div class="search-arrow<?php if($showing_warning){ echo ' hide';} ?>"><img src="<?php echo INSTANT_IMG_ADMIN_URL; ?>/assets/img/arrow-up.png" alt="" /></div>
</div>

<div id="unsplashwp">
	<div id="unsplashwp-api-message"><h3></h3><p></p></div>
	<div id="photos"></div>
</div>

<div class="loading-block"></div>
<div class="more-wrap">
   <button type="button" id="unsplashwp-load-more" value="" class="button"><?php _e('Load More Images', 'instant-images'); ?></button>
</div>
