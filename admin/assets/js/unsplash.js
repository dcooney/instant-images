var unsplash = unsplash || {};

jQuery(document).ready(function($) {
	"use strict"; 	      
   
   unsplash.init = true;
   unsplash.page = 1;
   unsplash.pages = 0;
   unsplash.width = instant_img_localize.download_width;
   unsplash.height = instant_img_localize.download_height;
   unsplash.posts_per_page = 20;
   unsplash.orderby = 'latest'; // latest | oldest | popular
   unsplash.masonryInit = true;
   unsplash.is_loading = true;
   unsplash.search_btn = $('#unsplashwp-search-submit');
   unsplash.search_input = $('input#unsplashwp-search');
   unsplash.search_input.focus();
   unsplash.loader = $('.instant-img-container .loading-block');
   unsplash.search_input.val('');
   unsplash.search_term = '';
   unsplash.el = $('.instant-img-container');
   unsplash.container = $('#unsplashwp', unsplash.el);
   unsplash.initialize = $('#initialize', unsplash.el);
   unsplash.photos = $('#photos', unsplash.container);
   unsplash.msg_template = $('#unsplashwp-api-message', unsplash.container);
   unsplash.btn = $('.instant-img-container button#unsplashwp-load-more');  
   
   
   
   /*
	 * unsplash.api
	 * Hit the unplash.com api
	 *
	 */
   unsplash.api = function(query){
	   	   
		unsplash.loading();
	   
		var photos = [],
			 api = 'https://api.unsplash.com/photos',
			 app_id = instant_img_localize.unsplash_app_id;
      
      if(app_id === ''){
         app_id = instant_img_localize.unsplash_default_app_id;
      }
	   
	   var url = api +"/?client_id="+ app_id +"&per_page="+ unsplash.posts_per_page +"&page="+ unsplash.page +"&order_by=" + unsplash.orderby +"";
	   
	   if(query !== ''){ 
   	   // Search   	
   	   api = 'https://api.unsplash.com/search/photos';
		   url = api +"/?client_id="+ app_id +"&per_page="+ unsplash.posts_per_page +"&query="+ query +"&page="+ unsplash.page +"&order_by=" + unsplash.orderby +"";
	   }	      
	   
	   $.getJSON( url, function( data ) {		
   	   		
			unsplash.btn.addClass('loading'); // Add loading class
			
			if(query !== ''){
   		   data = data.results;   	
         }
							 
			for (var elem in data) {
				photos.push(data[elem]);
			} 
			
			if(photos.length < unsplash.posts_per_page){
				unsplash.btn.addClass('disabled');
			} else {
   			unsplash.btn.removeClass('disabled')
			}		     
			unsplash.displayImages(photos);
						            
		}).error(function(xhr, textStatus, errorThrown) { 
   					
			$('h3', unsplash.msg_template).text(instant_img_localize.error_msg_title);
			$('p', unsplash.msg_template).text(instant_img_localize.error_msg_desc);
         unsplash.msg_template.show();
         unsplash.loaded();
         return;
				
		});
	   
   };   
   
   
   
   /*
	 * unsplash.displayImages
	 * Display the images returned from the Unsplash API
	 *
	 */
	
   unsplash.displayImages = function(photos){
      // If no results are returned
      if(photos.length < 1 && unsplash.page < 2){
         $('h3', unsplash.msg_template).text(instant_img_localize.no_results);
         $('p', unsplash.msg_template).text(instant_img_localize.no_results_desc);
         unsplash.msg_template.show();
         unsplash.loaded();
         return;
      } else {
	      unsplash.msg_template.hide();     
      }
	   
      // Loop photos
      var el = '';
      
      for(var i = 0; i < unsplash.posts_per_page; i++){	      
        
         // Wrap photos[i] in undefined function to avoid undefined image var
         if (undefined != photos[i]){
           
        	   var photo = photos[i],
        	  		id = photo.id,
               img = photo.urls.small,                                 
               full_size = photo.urls.full,
               author = photo.user.name,
               username = photo.user.username,
               link = photo.links.html,
               likes = photo.likes;
               
            // Build element   
            el += '<div class="item">';
            el += '<div class="img-wrap">';
            el += '<a class="upload" href="'+ link +'" data-id="'+id+'" data-url="'+full_size+'" data-desc="'+instant_img_localize.photo_by+' '+author+'" title="'+instant_img_localize.photo_by+' '+author+' - '+instant_img_localize.upload+'">';            
            el += '<div class="notice-msg"></div>';
            el += '<img src="'+ img +'" alt="'+instant_img_localize.photo_by+' '+author+'" />'
            el += '</a>';
            el += '<span class="num zoom-in" data-href="'+link+'" title="'+instant_img_localize.full_size+'"><i class="fa fa-search-plus"></i></span>';
            el += '<span class="num profile" data-href="https://unsplash.com/@'+username+'" title="'+instant_img_localize.view_all+' '+username+' @ unsplash.com"><i class="fa fa-user"></i></span>';
            el += '<span class="likes" title="'+likes+' '+instant_img_localize.likes+'">❤ '+likes+'</span>';
            el +='</div>';
            el += '</div>';
                        
         }                           
      }
      
      $(el).appendTo(unsplash.photos);
      
      if(unsplash.masonryInit){
         unsplash.el.removeClass('relax');
         unsplash.masonryInit = false;
         unsplash.photos.masonry({
   		  itemSelector: '.item'
   		});
   		$('.cnkt-main .expand').addClass('show');
		} else {
   		unsplash.photos.masonry('reloadItems');
		}
		// Imagesloaded
		unsplash.photos.imagesLoaded( function() {
			unsplash.photos.masonry();
			unsplash.loaded(); 
		});         
                             
   };
   
   
   
   /*
	 * unsplash.uploadImage
	 * Upload image to media library
	 *
	 */
	 
   unsplash.uploadImage = function(el, id, image, description){
      
      $('.notice-msg', el).text(instant_img_localize.saving+'...').addClass('active');
      if($('#unsplashwp-api-init').length){
         $('#unsplashwp-api-init').delay(200).slideUp(200);
      }
	   
	   $.ajax({
			type: 'POST',
			url: instant_img_localize.ajax_url,
			dataType: 'JSON',
			
			data: {
				action: 'instant_img_upload_image',
				id: id, 
				image: image, 
				description: description, 
				nonce: instant_img_localize.admin_nonce,
			},			
			success: function(response) {	   									  		
            //console.log(response); 
            
            if(response){
               var hasError = response.error,
                   path = response.path,
                   filename = response.filename,
                   desc = response.desc,
                   url = response.url,
                   msg = response.msg;
                                           
               if(hasError){
                  // Error    
                  $('.notice-msg', el).removeClass('active').text('');              
                  el.removeClass('saving').removeClass('uploaded');
                  if(!$('span.err', el).length){
                     el.append('<span class="err" title="'+ msg +'"><i class="fa fa-exclamation-circle"></i></span>');
                  }
               }else{ 
                  // Success!
                  unsplash.resizeImage(path, filename, desc, url, el);
               }
            }else{ // If response is empty
               unsplash.uploadError(el);
            }
			},			
			error: function(xhr, status, error) {
				console.log(error);
				unsplash.uploadError(el);
			}
      });
      
   } 
   
   
   
   
   
   /*
	 * unsplash.resizeImage
	 * Resize image and upload to media library
	 *
	 */
   unsplash.resizeImage = function(path, filename, desc, url, el){
      $('.notice-msg', el).text(instant_img_localize.resizing+'...');
      $.ajax({
			type: 'POST',
			url: instant_img_localize.ajax_url,
			dataType: 'JSON',
			
			data: {
				action: 'instant_img_resize_image',
				path: path, 
				filename: filename, 
				desc: desc, 
				url: url, 
				nonce: instant_img_localize.admin_nonce,
			},			
			success: function(response) {	   									  		
            //console.log(response);
            $('.notice-msg', el).removeClass('active').text('');
             
            if(response){
               
               var hasError = response.error,
                   msg = response.msg;
                                           
               if(hasError){ // Error
                  el.removeClass('saving').removeClass('uploaded');
                  if(!$('span.err', el).length){
                     el.append('<span class="err" title="'+ msg +'"><i class="fa fa-exclamation-circle"></i></span>');
                  }
               }else{ // Success!
                  el.removeClass('saving').addClass('uploaded');
                  if(!$('span.check', el).length){
                     el.append('<span class="check" title="'+ msg +'"><i class="fa fa-check"></i></span>');
                  }
               }
            }else{ // If reponse is empty
               unsplash.uploadError(el);
            }
            
			},			
			error: function(xhr, status, error) {
				console.log(error);
				unsplash.uploadError(el);
			}
      });
       
   };
   
   
   
   /* 
    * Error display
    */
   unsplash.uploadError = function(el){
      el.removeClass('saving').removeClass('uploaded');
      $('.notice-msg', el).removeClass('active');
      if(!$('span.err', el).length){
         el.append('<span class="err" title="'+ instant_img_localize.error_upload +'"><i class="fa fa-exclamation-circle"></i></span>');
      }
   };
   
   
      
   /* 
    * Upload Image Click Event
    */
   $(document).on('click', '#unsplashwp .item a.upload', function(e){
      
      var el = $(this);                                
      if(!el.hasClass('saving') && !el.hasClass('uploaded')){ // If not .saving or .uploaded, then proceed
         el.addClass('saving');
         e.preventDefault();
         var id = $(this).data('id'),
             image = $(this).data('url'),
             description = $(this).data('desc');   
                       
         unsplash.uploadImage(el, id, image, description);          
      }else{  	                                  
         e.preventDefault();
      }    
                 
   });
   
   
    
   /* 
    * Full size click
    */
   $(document).on('click', '#unsplashwp .item .zoom-in, #unsplashwp .item .profile', function(e){
      var el = $(this),
          href = el.data('href');
      window.open(href);
   });
                        
   
   
   /* 
    * Search : Term
    */ 
   unsplash.search_btn.on('click', function(){
	   var el = $(this),
	       query = unsplash.search_input.val();
	   
	   // if query is unique
	   if(query !== unsplash.search_term){
   	   unsplash.search_term = unsplash.search_input.val();
   		
   		if(unsplash.search_term !== ''){
   			unsplash.destroy();
   			$('.unsplashwp-search .clear-results').show();
   			unsplash.api(unsplash.search_term);
   		} else {
   			unsplash.search_input.focus();
   			$('.unsplashwp-search .clear-results').hide();
   		}
		}else{
   		unsplash.search_input.focus();   		
		}
		
   });
   $('form#photo-search').on('submit', function(e){
      e.preventDefault();
      unsplash.search_btn.trigger('click');
   });
   
   
   
   /* 
    * Search : CLear Results
    */ 
   $('.unsplashwp-search .clear-results').on('click', function(e){
      e.preventDefault();
      unsplash.search_term = '';      
		unsplash.search_input.val('');
      unsplash.destroy();	
      unsplash.api('');
   });
   
   
   
   /* 
    * Order By : Select
    */ 
   $('#unsplash-order li a').on('click', function(e){
      e.preventDefault();
      var el = $(this),
          val = el.data('id');
      if(!el.hasClass('active')){
         //el.closest('.btn').trigger('click'); // close drop menu
         $('#unsplash-order li a').removeClass('active');
         el.addClass('active');
         unsplash.orderby = val;  
         // If not search, then proceed
         if(unsplash.search_term === ''){    
            unsplash.destroy();
            unsplash.api('');
         }
      }
   });
   
   /* 
    * Order By : Init screen
    */ 
   $('.init-options button', unsplash.initialize).on('click', function(e){
      var el = $(this),
          val = el.data('id');
          
      $('#unsplash-order li a[data-id='+val+']').trigger('click'); // Trigger order button in options drop
   });
   
   
   
   /* 
    * Fake Search : Init screen
    */ 
   $('#fake-search', unsplash.initialize).on('click', function(e){
      e.preventDefault();
      var el = $(this),
          val = el.text();
      
      unsplash.search_input.val(val);
      $('form#photo-search').submit();   
   });
   
   
    
   /* 
    * Load more button
    */
   unsplash.btn.on('click', function(){
	   var el = $(this);
	   
	   if(!el.hasClass('disabled') && !unsplash.is_loading){
		   el.addClass('loading');
		   unsplash.page++;		   
		   if(unsplash.search_term !== ''){			   
		   	unsplash.api(unsplash.search_term); // Is search
		   }else{
		   	unsplash.api('');
		   }
	   }      
      
   }); 
   
   
   
   
   /* HELPER FUNCTIONS */
   
   
   /*
	 * unsplash.loading
	 * Loading...
	 *
	 */
   unsplash.loading = function(){
      if(unsplash.init){         
         unsplash.initialize.slideUp(250);
         unsplash.init = false;
      }
      $.fn.trackUsage();
      unsplash.loader.show();
	   unsplash.btn.addClass('loading');
		unsplash.is_loading = true;
   };
   
   
   
   /*
	 * unsplash.loaded
	 * Loading Complete
	 *
	 */
   unsplash.loaded = function(){
      // Delay this for 1/4 second
      setTimeout(function(){ 
         unsplash.loader.hide();
         unsplash.btn.removeClass('loading');
   		$('a.upload', unsplash.photos).addClass('loaded');
   		unsplash.is_loading = false;    		
      }, 250);	   
   };
   
   
   
   /*
	 * unsplash.destroy
	 * Destroy the current listing
	 *
	 */
   unsplash.destroy = function(){	   
      unsplash.page = 1;
      // Destroy Masonry if it is active
      if(!unsplash.masonryInit){
         unsplash.photos.empty().masonry('destroy');
      }
      unsplash.masonryInit = true;
		$('.unsplashwp-search .clear-results').hide();
   };
      
   
   // Init app.
   if(unsplash.container.length && !unsplash.el.hasClass('relax')){
      unsplash.api('');             
   }      
         
   
});