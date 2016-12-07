<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
?>
<div class="instant-img-container relax">
	<div class="wrap">
		
	   <div class="header-wrap">
         <h1><?php echo INSTANT_IMG_TITLE; ?> <span><?php echo INSTANT_IMG_VERSION; ?></span></h1>
         <p><?php _e('One click uploads of <a href="https://unsplash.com/" target="_blank">unsplash.com</a> photos directly to your media library (formally UnsplashWP)', 'instant-images'); ?></p>            
      </div>
      
	   <div class="cnkt-main">
	   	<div class="group">   		   	   
   			<?php include( INSTANT_IMG_PATH . 'admin/views/unsplash-app.php');	?>  	   			
	   	</div>
	   	<a href="#" class="expand" title="Expand/Collapse"><i class="fa fa-expand open" aria-hidden="true"></i><i class="fa fa-close close"></i><span><?php _e('Expand', 'instant-images'); ?></span></a>
	   </div>	
	   	   
	   <div class="cnkt-sidebar">
   	   <?php include( INSTANT_IMG_PATH . 'admin/includes/cta/permissions.php'); ?>
   	   
	      <div class="cta">		     
   	      
   	      <form action="options.php" method="post" id="unsplash-form-options">   		         
				<?php 
					settings_fields( 'instant-img-setting-group' );
					do_settings_sections( 'instant-images' );	
					//get the older values, wont work the first time
					$options = get_option( 'instant_img_settings' ); 
			   ?>	
					<div class="save-settings">	       
		            <?php submit_button(__('Save Settings', 'instant-images')); ?>
		            <div class="loading"></div>	   		            
					</div>	 
               <script type="text/javascript">
                  jQuery(document).ready(function() {
                     jQuery('#unsplash-form-options').submit(function() { 
                        jQuery('.save-settings .loading').fadeIn();
                        jQuery(this).ajaxSubmit({
                           success: function(){
                              jQuery('.save-settings .loading').fadeOut(250, function(){
                                 window.location.reload();
                              });
                           },
                           error: function(){
                              jQuery('.save-settings .loading').fadeOut();
                              alert("<?php _e('Sorry, settings could not be saved.', 'instant-images'); ?>");
                           }
                        }); 
                        return false; 
                     });
                  });
               </script>       
   			</form>	
	      </div>
			<?php include( INSTANT_IMG_PATH . 'admin/includes/cta/about.php'); ?>
	   </div>		   	
	</div>
	
</div>