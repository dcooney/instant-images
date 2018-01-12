var instant = instant || {};

jQuery(document).ready(function($) {
	"use strict"; 	
	
	
	
	/*
	 * Dropdowns
	 *
	 */
	 
	 instant.dropDown = function(e) {
        var el = e.parent();
        var dropdown = $('.dropdown', el);
        
        if($(el).hasClass('active')){//If is currently active, hide it
            el.removeClass('active');
            $('.dropdown', el).removeClass('active');
            return false;
        }else if($('.dropdown').hasClass('active')){
            $('.dropdown').each(function(i){
                $(this).removeClass('active');
                $(this).parent().removeClass('active');
            });
        }   
        
        $('.dropdown').removeClass('active');//remove active states from currently open dropdowns
        el.addClass('active');
        $('.dropdown', el).addClass('active');
        
        $('#wpwrap').unbind('click').bind('click', instant.closeDropDown); // Bind click event to site container   
        dropdown.click(function(e){
            e.stopPropagation();
        }); 
    };
    instant.closeDropDown = function() {
        $('.dropdown').each(function(i) {
            $(this).removeClass('active');
            $(this).parent().removeClass('active');
        });
    };
	 
	 // Click
    $('.dropdown').each(function(i){
        var el = $(this).parent('.btn');
        $('> a', el).click(function(e){
            var e = $(this);
            instant.dropDown(e);
            return false;
        });
   });
	
   
   
   /*
	 * Expand the listing columns
	 *
	 */
    
   $('.instant-img-container .cnkt-main a.expand').click(function(){
      var el = $(this),
          maincol = $('.instant-img-container .cnkt-main'),
          sidebar = $('.instant-img-container .cnkt-sidebar');
      if(maincol.hasClass('full')){
         el.removeClass('full');
         maincol.removeClass('full');
         sidebar.removeClass('full');
      }else{
         el.addClass('full');
         maincol.addClass('full');
         sidebar.addClass('full');
      }
      setTimeout(function(){
         unsplash.photos.masonry(); 
      }, 50);
   });
   
   
	
});    