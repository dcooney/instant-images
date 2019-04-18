<section class="instant-images-settings">
	
   <div class="cnkt-sidebar">

      <section class="cta ii-settings">
	      <h2><?php _e('Unsplash Settings', 'instant-images'); ?></h2>
	      <p><?php _e('Manage your media upload settings', 'instant-images'); ?>.</p>
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
						<div class="clear"></div>
					</div>
	   		</form>
	      </div>
	      <div class="spacer sm"></div>
	      <h2 class="w-border"><?php _e('What\'s New', 'instant-images'); ?></h2>
	      <p><?php _e('The latest Instant Images updates', 'instant-images'); ?>.</p>
	      <div class="cta-wrap">
		      <h4><span>4.0</span></h4>
		      <ul class="whats-new">
			      <li>Gutenberg Support - Instant Images directly integrates with Gutenberg as a plugin sidebar..</li>
			      <li>Better image uploading and error handling.</li>
			      <li>Added `instant_images_user_role` filter to allow for control over user capability.</li>
			      <li>Updated to meet revised <a href="https://medium.com/unsplash/unsplash-api-guidelines-28e0216e6daa" target="_blank">Unsplash API guidelines</a>.</li>
			      <li>Adding support for searching individual photos by Unsplash ID - searching <pre>id:{photo_id}</pre> will return a single result.<br/>e.g. <pre>id:YiUi00uqKk8</pre></li>
		      </ul>
	      </div>
      </section>
      
		<?php 
      $plugin_array = array(
         array(
            'slug' => 'ajax-load-more',
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