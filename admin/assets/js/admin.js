var instant_images = instant_images || {};

jQuery(document).ready(function($) {
	"use strict"; 	
   
   var init = true;
   var settingsDiv = $('.instant-images-settings');   
   
   // Show Settings
   $('.header-wrap button').on('click', function(){
	   var el = $(this);
	   if(settingsDiv.hasClass('active')){
		   settingsDiv.slideUp(200, function(){
			   el.find('i').removeClass('fa-close').addClass('fa-cog');
			   settingsDiv.removeClass('active');
		   });
	   }else{
		   settingsDiv.slideDown(200, function(){
			   el.find('i').addClass('fa-close').removeClass('fa-cog');
			   settingsDiv.addClass('active');
		   });
	   }
   });
   
   
   // Save Form
   $('#unsplash-form-options').submit(function() {
      $('.save-settings .loading').fadeIn();
      $(this).ajaxSubmit({
         success: function(){
            $('.save-settings .loading').fadeOut(250, function(){
               //window.location.reload();
            });
         },
         error: function(){
            $('.save-settings .loading').fadeOut();
            alert("Sorry, settings could not be saved");
         }
      });
      return false;
   });
   
   
   
   /* 
    * Onboarding Modal Popups
    *
    */
    
   // Function called from React App
   instant_images.initOnboarding = function(){        
      if($('.onboarding').length && init){   
         init = false;   
         
         // Get modals
         var modals = $('.onboarding');
         
         // Move modals to closing body
         modals.each(function() {
            $(this).appendTo('body');
         });
         
         // Position on resize
         $(window).resize(function(){
            setTimeout(function(){
               instant_images.loopOnboarding(modals)
            }, 200)
         });
         
         instant_images.loopOnboarding(modals);     
      }    
   };
   
   
   instant_images.loopOnboarding = function(el){
      el.each(function( index ) {
         instant_images.positionOnboarding($(this));
      });
   };
   
   
   // Position onboarding modals
   instant_images.positionOnboarding = function(el){       
      var type = el.data('type');
      var targetElement = document.querySelector('#'+type);
      var position = targetElement.getBoundingClientRect();  
      
      var posTop = position.top + el.height() + 2;
      
      if(el.hasClass('bottom')){
         posTop = posTop - el.height()*2 - 4;
      }
      
      
      var posLeft = position.left - (el.width()/2) + ($(targetElement).width()/2);   
      el.css({'top': posTop + 'px', 'left': posLeft + 'px'});      
   };
   
   /*
   <div class="onboarding bottom" data-type="nav-target">
      <div class="inner">
         <?php _e('Browse by New, Popular and Oldest', 'instant-images'); ?> <a href="#">&times;</a>
      </div>
   </div>
   */
   
   
	
});    