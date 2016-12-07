jQuery(document).ready(function($) {
	"use strict"; 	    
   
   
   /*
	 * unsplashwp.trackUsage
	 * Track API Usage
	 *
	 */
	$.fn.trackUsage = function(){   	
   	// Track API usage if App ID is still the default APP Id 
   	if(instant_img_localize.unsplash_app_id === instant_img_localize.unsplash_default_app_id){   	
   	   $.ajax({
   			type: 'POST',
   			url: instant_img_localize.ajax_url,		
   			data: {
   				action: 'instant_img_api_limit',
   				nonce: instant_img_localize.admin_nonce,
   			},
   	      success: function(response) {
   	         //console.log('API Usage: '+response+' requests');
   	         if($('#unplash-api-usage').length){
   	            //$('#unplash-api-usage').text(response);
   	         }
   	      }
   	   });
	   }	   
   }    
   
   
   
   /*
	 * unsplashwp.dismissWarning
	 * Dismiss the API warning displayed on the photos page
	 *
	 */
	$.fn.dismissWarning = function(){   	
	   $.ajax({
			type: 'POST',
			url: instant_img_localize.ajax_url,		
			data: {
				action: 'instant_img_dismiss_warning',
				nonce: instant_img_localize.admin_nonce,
			},
	      success: function(response) {
   	      $('#unsplashwp-api-warning').slideUp(200, function(){
      	      console.log('Warning dismissed');
   	      });	         
	      }
	   });
   }
   
   $('#unsplashwp-api-warning .dismiss').on('click', function(e){
      e.preventDefault();
      $.fn.dismissWarning();
   });
   
   
});