<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
?>
<?php
   // If directory does NOT exist, create it
   if(!is_dir(INSTANT_IMG_UPLOAD_PATH)){
      mkdir(INSTANT_IMG_UPLOAD_PATH);
   }
   // Does directory exist and is it writeable
   if (!is_writable(INSTANT_IMG_UPLOAD_PATH.'/')) {       
   ?>
   <div class="permissions-warning">
      <div class="inner">
         <h3><i class="fa fa-exclamation-triangle" aria-hidden="true" style="color: #d54343;"></i> <?php _e('Permissions Error', 'instant-images'); ?></h3>
         <p><?php _e('Instant Images is unable to download and process images on your server.', 'instant-images'); ?></p>
         <p><?php _e('Please enable read/write access to the following directory', 'instant-images'); ?>:</p>
         <input type="text" readonly="readonly" value="<?php echo INSTANT_IMG_UPLOAD_URL; ?>">
      </div>
   </div>
<?php } ?>
