var drops = drops || {};
(function($) {
    "use strict";
    
    drops.dropDown = function(e) {
        var el = e.parent();
        var dropdown = $('.dropdown', el);
        var text = $('input[type="text"]', el);
        
        if($(el).hasClass('active')){//If is currently active, hide it
            el.removeClass('active');
            $('.dropdown', el).removeClass('active');
            return false;
        }
        else if($('.dropdown').hasClass('active')){
            $('.dropdown').each(function(i){
                $(this).removeClass('active');
                $(this).parent().removeClass('active');
            });
        }    
        
        $('.dropdown').removeClass('active');//remove active states from currently open dropdowns
        el.addClass('active');
        $('.dropdown', el).addClass('active');
        text.focus(); //Focus on input boxes
        
        $('#container').unbind('click').bind('click', drops.closeDropDown); // Bind click event to site container   
        dropdown.click(function(e){
            e.stopPropagation();
        }); 
    };
    drops.closeDropDown = function() {
        $('.dropdown').each(function(i) {
            $(this).removeClass('active');
            $(this).parent().removeClass('active');
        });
    };    
    
    //Dropdown links
    $('.dropdown').each(function(i){
        var el = $(this).parent('.btn');
        $('> a', el).click(function(e){
            var e = $(this);
            drops.dropDown(e);
            return false;
        });
    });
})(jQuery);