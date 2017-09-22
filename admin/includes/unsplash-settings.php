<section class="instant-images-settings">
	
   <div class="cnkt-sidebar">
	   <?php include( INSTANT_IMG_PATH . 'admin/includes/cta/permissions.php'); ?>

      <section class="cta ii-settings">
	      <h2><?php _e('Unsplash Settings', 'instant-images'); ?></h2>
	      <p><?php _e('Manage your media upload settings', 'instant-images'); ?></p>
	      <div class="cta-wrap">
		  		<form action="options.php" method="post" id="unsplash-form-options">
				   <?php
						settings_fields( 'instant-img-setting-group' );
						do_settings_sections( 'instant-images' );						
						$options = get_option( 'instant_img_settings' ); //get the older values, wont work the first time
			      ?>
					<div class="save-settings">
		            <?php submit_button(__('Save Settings', 'instant-images')); ?>
						<div class="loading"></div>
					</div>
                <script type="text/javascript">
                  jQuery(document).ready(function() {
                     
                  });
                </script>
	   		</form>
	      </div>
      </section>
      
		<?php 
      $plugin_array = array(
         array(
            'slug' => 'ajax-load-more',
         ),
         array(
            'slug' => 'broadcast-call-to-actions'
         ),
         array(
            'slug' => 'easy-query'
         ),
         array(
            'slug' => 'velocity',
         )
      );
      ?>      
      <section class="cta ii-plugins">
	      <h2><?php _e('Our Plugins', 'instant-images'); ?></h2>
	      <p><strong>Instant Images</strong> is made with <span style="color: #e25555;">♥</span> by <a target="blank" href="https://connekthq.com/?utm_source=WPAdmin&utm_medium=InstantImages&utm_campaign=OurPlugins">Connekt</a></p>
	      <div class="cta-wrap">
		      <?php 
		      if(class_exists('Connekt_Plugin_Installer')){
		         Connekt_Plugin_Installer::init($plugin_array);
		      }
				?>
	      </div>
      </section>
      
   </div>

</section>