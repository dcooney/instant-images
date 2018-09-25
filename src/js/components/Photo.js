import React from 'react';
import API from './API';

class Photo extends React.Component {   
   
   constructor(props) {
      super(props);
      
      this.id = this.props.result.id;
      this.thumb = this.props.result.urls.thumb;     
      this.img = this.props.result.urls.small;                                     
      this.full_size = this.props.result.urls.raw;
      this.author = this.props.result.user.name;
      this.img_title = `${instant_img_localize.photo_by} ${this.author}`;      
      this.filename = this.props.result.id;    
      this.alt = '';
      this.caption = '';
      this.user = this.props.result.user.username;
      this.user_photo = this.props.result.user.profile_image.small;
      this.link = this.props.result.links.html;
      this.likes = this.props.result.likes;
      this.view_all = instant_img_localize.view_all;
      this.like_text = instant_img_localize.likes;
      this.inProgress = false;
      this.container = document.querySelector('.instant-img-container');      
      
      this.state = { 
         filename: this.filename,
         alt: this.alt,
         caption: this.caption
      }
   }
    
   
   
   /*
	 * uploadPhoto
	 * Function to trigger image upload 
	 * 
	 * @param target   element    clicked item
	 * @since 3.0
	 */
   uploadPhoto(e){      
	   e.preventDefault();
	   
	   let self = this;
	   let target = e.currentTarget; // get current <a/>	 
	   let photo = target.parentElement.parentElement.parentElement; // Get parent .photo el 
	   let notice = photo.querySelector('.notice-msg'); // Locate .notice-msg div 
      
      if(!target.classList.contains('upload')){ // If target is .download-photo, switch target definition
         target = photo.querySelector('a.upload');
      }	   	   
	   
	   if(target.classList.contains('success') || this.inProgress)
	      return false; // Exit if already uploaded or in progress.
	   
	   target.classList.add('uploading');
	   photo.classList.add('in-progress');
	   notice.innerHTML = instant_img_localize.saving;
	   this.inProgress = true;	   	     
	     
	   // Create Data Array  
	   let data = {
	      'id' : target.getAttribute('data-id'),
         'image' : target.getAttribute('data-url')
      }      
      
      // REST API URL
      let uploadURL = instant_img_localize.root + 'instant-images/upload/';

      
      var requestUploadImg = new XMLHttpRequest();
      requestUploadImg.open('POST', uploadURL, true);
      requestUploadImg.setRequestHeader('X-WP-Nonce', instant_img_localize.nonce);
      requestUploadImg.setRequestHeader('Content-Type', 'application/json');
      requestUploadImg.send(JSON.stringify(data));
      
      requestUploadImg.onload = function() {
         if (requestUploadImg.status >= 200 && requestUploadImg.status < 400) { // Success
                        
            let response = JSON.parse(requestUploadImg.response);
            
            if(response){
                              
               let hasError = response.error;
               let path = response.path;
               let filename = response.filename;
                   
               if(hasError){ // Error
                  self.uploadError(target, photo, response.msg);
                  
               } else { // Success
                  self.resizeImage(path, filename, target, photo, notice);
                  self.triggerUnsplashDownload(data.id);
                  
               }
            }
            
         } else {
	         // Error
            self.uploadError(target, photo, instant_img_localize.error_upload);      
         }
      };      
      
      requestUploadImg.onerror = function() {
         self.uploadError(target, photo, instant_img_localize.error_upload);
      }; 

   }
   
   
   
   /*
	 * resizeImage
	 * Function to trigger image resize 
	 * 
	 * @param path       string    full server path to image
	 * @param filename   string    clicked item  
	 * @param target     element   clicked item 
	 * @param photo      element   Nearest parent .photo  
	 * @param notice     string    Text to be display
	 * @since 3.0
	 */
   resizeImage(path, filename, target, photo, notice){        
      let self = this;
      
      target.classList.remove('uploading');
      target.classList.add('resizing');
      notice.innerHTML = instant_img_localize.resizing;
      
      // Create Data Array	     
	   let data = { // store data in JSON to pass to XMLHttpRequest
	      'path' : path,
         'filename' : filename,
         'title' : target.getAttribute('data-title'),
         'custom_filename' : target.getAttribute('data-filename'),
         'alt' : target.getAttribute('data-alt'),
         'caption' : target.getAttribute('data-caption'),
      }      
      
      // REST API URL
      let resizeURL= instant_img_localize.root + 'instant-images/resize/';
      let resizeMsg = '';
            
      var requestResizeImg = new XMLHttpRequest();
      requestResizeImg.open('POST', resizeURL, true);
      requestResizeImg.setRequestHeader('X-WP-Nonce', instant_img_localize.nonce);
      requestResizeImg.setRequestHeader('Content-Type', 'application/json');
      requestResizeImg.send(JSON.stringify(data));
      
      requestResizeImg.onload = function() {
         if (requestResizeImg.status >= 200 && requestResizeImg.status < 400) { // Success
                        
            let response = JSON.parse(requestResizeImg.response);
                      
            let success = response.success;
            let attachment_id = response.id;
            resizeMsg = response.msg;
            
            if(success){ 
               
	            // Success
               self.uploadComplete(target, photo, resizeMsg); 
               
               // If is media popup, redirect user to media-upload settings
               if(self.container.dataset.mediaPopup === 'true'){
	               window.location = 'media-upload.php?type=image&tab=library&attachment_id='+attachment_id;	               
               }                  
                             
            }else{
               
	            // Error
	            self.uploadError(target, photo, resizeMsg);
	            
            }
         } else {
	         // Error
	         self.uploadError(target, photo, instant_img_localize.error_resize);
         }
      }       
      
      requestResizeImg.onerror = function() {
         self.uploadError(target, photo, instant_img_localize.error_resize);
      };    
   }
   
   
   
   /*
	 * triggerUnsplashDownload
	 * Function to trigger download action at unsplash.com
	 * This is used to give authors download credits and nothing more
	 * 
	 * @param id       string    The ID of the image
	 * @since 3.1
	 */
   triggerUnsplashDownload(id){
      
      let url = `${API.photo_api}/${id}/download/${API.app_id}`;
      
      fetch(url)
	      .then((data) => data.json())
	      .then(function(data) {  
	         // Success, nothing else happens here          
	      })
	      .catch(function(error) {
	         console.log(error);
	      });
   }
   
   
   
   /*
	 * uploadComplete
	 * Function runs when upload has completed
	 * 
	 * @param target   element    clicked item  
	 * @param photo    element    Nearest parent .photo
	 * @param msg      string     Success Msg
	 * @since 3.0
	 */
   uploadComplete(target, photo, msg){
      
	   this.setImageTitle(target, msg);
	   
	   photo.classList.remove('in-progress');
	   photo.classList.add('uploaded');
	   photo.querySelector('.edit-photo').remove(); // Hide edit-photo button
	   
	   target.classList.remove('uploading');
	   target.classList.remove('resizing');
      target.classList.add('success'); 
      	   
	   this.inProgress = false;
	   
	   // Refresh Media Library contents on edit pages               
      if(this.container.classList.contains('editor')){
	      //console.log(wp.media.frame.setState());
         if(typeof wp.media != 'undefined'){
            if(wp.media.frame.content.get() !== null){
				   wp.media.frame.content.get().collection.props.set({ignore: (+ new Date())});
				   wp.media.frame.content.get().options.selection.reset();
				}else{
					wp.media.frame.library.props.set({ignore: (+ new Date())});
				}
			}
		}
	   
   }
   
   
   
   /*
	 * uploadError
	 * Function runs when error occurs on upload or resize
	 * 
	 * @param target   element    Current clicked item
	 * @param photo    element    Nearest parent .photo
	 * @param msg      string     Error Msg
	 * @since 3.0
	 */
   uploadError(target, photo, msg){
	   target.classList.remove('uploading');
	   target.classList.remove('resizing');
	   target.classList.add('errors');
	   this.setImageTitle(target, msg);
      this.inProgress = false;
      console.warn(msg);
   }
   
   
   
   /*
	 * setImageTitle
	 * Set the title attribute of target
	 * 
	 * @param target   element    Current clicked item
	 * @param msg      string     Title Msg from JSON
	 * @since 3.0
	 */
   setImageTitle(target, msg){	   
	   target.setAttribute("title", msg); // Remove 'Click to upload...', set new value
   }
   
   
   
   /*
	 * showEditScreen
	 * Displays the edit screen 
	 * 
	 * @since 3.2
	 */
   showEditScreen(e){
      e.preventDefault();
      let el = e.currentTarget;
      let photo = el.closest('.photo'); 
      let filename = photo.querySelector('input[name="filename"]');
      let editScreen = photo.querySelector('.edit-screen');
      
      editScreen.classList.add('editing'); // Show edit screen
      
      // Set focus on edit screen
      setTimeout(function(){
         editScreen.focus();
      }, 150);
      
   }
   
   
   
   /*
	 * handleEditChange
	 * Handles the change event for the edit screen 
	 * 
	 * @since 3.2
	 */
   handleEditChange(e) {
      let target = e.target.name;
      
      if(target === 'filename'){
         this.setState({
            filename: e.target.value
         });
      }
      if(target === 'alt'){
         this.setState({
            alt: e.target.value
         });
      }
      if(target === 'caption'){
         this.setState({
            caption: e.target.value
         });
      }
   }
   
   
   
   /*
	 * saveEditChange
	 * Handles the save event for the edit screen 
	 * 
	 * @since 3.2
	 */
   saveEditChange(e) {
      
      let el = e.currentTarget;
      let photo = el.closest('.photo'); 
      
      let filename = photo.querySelector('input[name="filename"]');
      this.filename = filename.value;
      let alt = photo.querySelector('input[name="alt"]');
      this.alt = alt.value;
      let caption = photo.querySelector('textarea[name="caption"]');
      this.caption = caption.value;
      
      photo.querySelector('.edit-screen').classList.remove('editing'); // Hide edit screen
      photo.querySelector('a.upload').focus();      
   }   
   
   
   
   
   /*
	 * cancelEditChange
	 * Handles the cancel event for the edit screen 
	 * 
	 * @since 3.2
	 */
   cancelEditChange(e) {
      
      let el = e.currentTarget;
      let photo = el.closest('.photo'); 
      
      let filename = photo.querySelector('input[name="filename"]');
      filename.value = this.filename;
      let alt = photo.querySelector('input[name="alt"]');
      alt.value = this.alt;
      let caption = photo.querySelector('textarea[name="caption"]');
      caption.value = this.caption;
      
      photo.querySelector('.edit-screen').classList.remove('editing'); // Hide edit screen      
      photo.focus();
   }   
   
   
   
   
   render(){
      
      return (
	      <article className='photo' tabIndex="0">
	         <div className="photo--wrap">
   	         <div className='img-wrap'>
   	         
   	            <a 
   	            	className='upload loaded' 
   						href={this.full_size} 
   						data-id={this.id} 
   						data-url={this.full_size} 
   						data-title={this.img_title}
   						data-filename={this.state.filename}
   						data-alt={this.state.alt}
   						data-caption={this.state.caption}
   						title={instant_img_localize.upload} 
   						onClick={(e) => this.uploadPhoto(e)}>
   	               <img src={this.img} alt="" />
   	               <div className="status" />                
   	            </a>         
   	                        
   	            <div className="notice-msg"/>  
   	            
   	            <div className="user-controls">
      	            <a 
      	               className="edit-photo fade"
      	               href="#" 
      	               title={instant_img_localize.edit_details} 
      						onClick={(e) => this.showEditScreen(e)}	               
      	               >
      	               <i className="fa fa-cog"></i>
      	            </a>      	            
      	            <a className="external-photo fade" 
      	               href={this.link} 
      	               title={instant_img_localize.view_on_unsplash} 
      	               target="_blank">
      	               <i className="fa fa-external-link"></i>
      	            </a>       	            
      	            <a className="user fade" href={'https://unsplash.com/@'+this.user+'?utm_source=wordpress-instant-images&utm_medium=referral'} target="_blank" title={this.view_all +' @'+ this.user}>
      		            <div className="user-wrap">
      		               {this.user_photo.length > 0 &&
      		                  <img src={this.user_photo} /> 
      		               }
      		               {this.user}
      		            </div>
      	            </a>        	                         
      	            <span className="likes fade" title={this.likes +' ' + this.like_text}><i className="fa fa-heart"></i> {this.likes}</span>
   	            </div>
               </div>            
   	            
	            <div className="edit-screen" tabIndex="0">
	               <div className="edit-screen--title">
	                  <p className="heading">{instant_img_localize.edit_details}</p>	   
	                  <p>{instant_img_localize.edit_details_intro}.</p>            
	               </div>
	               <label>
	                  <span>{instant_img_localize.edit_filename}:</span>
	                  <input type="text" name="filename" placeholder={this.filename} value={this.state.filename} onChange={(e) => this.handleEditChange(e)} />
	                  <em>.jpg</em>
	               </label>
	               <label>
	                  <span>{instant_img_localize.edit_alt}:</span>
	                  <input type="text" name="alt" value={this.state.alt} onChange={(e) => this.handleEditChange(e)} />
	               </label>
	               <label>
	                  <span>{instant_img_localize.edit_caption}:</span>
	                  <textarea rows="3" name="caption" onChange={(e) => this.handleEditChange(e)} value={this.state.caption}></textarea>
	               </label>
	               <div className="edit-screen--controls">
	                  <button type="button" className="button" onClick={(e) => this.cancelEditChange(e)}>{instant_img_localize.cancel}</button> &nbsp; 
	                  <button type="button" className="button button-primary" onClick={(e) => this.saveEditChange(e)}>{instant_img_localize.save}</button>
	               </div>
	            </div>
	            
	         </div>
	      </article>
      )
   }
}

export default Photo;