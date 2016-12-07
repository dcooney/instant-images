<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
?>

<div id="unsplashwp-api-warning">
   <div class="inner">
      <h4><?php _e('Did you know', 'instant-images'); ?>?</h4>
      <p>Unsplash has a rate limit of 5000 API calls per hour. You can help offset the API usage of Instant Images by simply <a href="https://unsplash.com/developers/register" target="_blank">registering as a developer</a> then creating your own application directly @ <a href="https://unsplash.com/login" target="_blank">Unsplash</a>.</p>
      
      <a href="<?php echo INSTANT_IMG_HELP_URL; ?>" target="_blank" class="button button-primary"><i class="fa fa-chevron-right"></i>&nbsp; <?php _e('Learn More', 'instant-images'); ?></a> &nbsp; 
      <a href="#" class="button dismiss"><i class="fa fa-times-circle"></i>&nbsp; <?php _e('No Thanks', 'instant-images'); ?></a>
   </div>
</div>