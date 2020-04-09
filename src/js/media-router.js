import React from 'react';
import ReactDOM from 'react-dom';
import API from './components/API';
import PhotoList from './components/PhotoList'; 

// Gutenberg Support
import SetFeaturedImage from "./block/components/setFeaturedImage"; // Featured Image
import InsertImage from "./block/components/insertImage"; // Insert Image
require('es6-promise').polyfill();
require('isomorphic-fetch');
require('./components/Helpers'); 


// Global vars
let activeFrameId = '';
let activeFrame = '';


// Load MediaFrame deps
const oldMediaFrame = wp.media.view.MediaFrame.Post;
const oldMediaFrameSelect = wp.media.view.MediaFrame.Select;


// Create Instant Images Tabs
wp.media.view.MediaFrame.Select = oldMediaFrameSelect.extend( {

	// Tab / Router
	browseRouter( routerView ) {
		oldMediaFrameSelect.prototype.browseRouter.apply( this, arguments );
		routerView.set( {
			instantimages: {
				text: instant_img_localize.instant_images,
				priority: 99,
			},
		} );
	},

	// Handlers
	bindHandlers() {
		oldMediaFrameSelect.prototype.bindHandlers.apply( this, arguments );
		this.on( 'content:create:instantimages', this.frameContent, this );
	},

	/**
	 * Render callback for the content region in the `browse` mode.
	 *
	 * @param {wp.media.controller.Region} contentRegion
	 */
	frameContent( contentRegion ) {
		const state = this.state();
		// Get active frame
		if(state){
			activeFrameId = state.id;
			activeFrame = state.frame.el;
		}
	},
	
	getFrame(id) {
		return this.states.findWhere({ id });
	}
	
});


wp.media.view.MediaFrame.Post = oldMediaFrame.extend( {

	// Tab / Router
	browseRouter( routerView ) {
		oldMediaFrameSelect.prototype.browseRouter.apply( this, arguments );
		routerView.set( {
			instantimages: {
				text: instant_img_localize.instant_images,
				priority: 60,
			},
		} );
	},

	// Handlers
	bindHandlers() {
		oldMediaFrame.prototype.bindHandlers.apply( this, arguments );
		this.on( 'content:create:instantimages', this.frameContent, this );
	},

	/**
	 * Render callback for the content region in the `browse` mode.
	 *
	 * @param {wp.media.controller.Region} contentRegion
	 */
	frameContent(contentRegion) {
		const state = this.state();
		// Get active frame
		if(state){
			activeFrameId = state.id;
			activeFrame = state.frame.el;
		}
	},
	
	getFrame(id) {
		return this.states.findWhere({ id });
	}
	
});


// Render Instant Images
const instantImagesMediaTab = () => {
		
   let html = createMediaWrapper(); // Create HTML wrapper
   
   if(!activeFrame){
	   return false;
   }
   
   let modal = activeFrame.querySelector('.media-frame-content'); // Get all media modals   
   if(!modal){ // Exit if not modal
	   return false;
   }
   
   modal.innerHTML = ''; // Clear Modal
	modal.appendChild(html); // Append Instant Images
		
	let element = modal.querySelector('#instant-images-media-router-'+activeFrameId);
	if(!element){ // Exit if not element
		return false;
	}
	
	ReactDOM.render( 
     <PhotoList element={element} editor='media-router' results='' page='1' orderby='latest' service='unsplash' SetFeaturedImage={SetFeaturedImage} InsertImage={InsertImage} />,
     element
   ); 
	
}


// Create HTML markup
const createMediaWrapper = () => {
	let wrapper = document.createElement('div');
	wrapper.classList.add('instant-img-container');
	let container = document.createElement('div');
	container.classList.add('instant-images-wrapper');
	let frame = document.createElement('div');
	frame.setAttribute('id', 'instant-images-media-router-'+activeFrameId);
	
	container.appendChild(frame);
	wrapper.appendChild(container);
    
   return wrapper;
}


// Document Ready
jQuery(document).ready(function($){
	
	if ( wp.media ) {
		
		// Open
		wp.media.view.Modal.prototype.on( "open", function() {
			console.log(wp.media.frame);
			if(!activeFrame){
				return false;
			}
			let selectedTab = activeFrame.querySelector('.media-router button.media-menu-item.active');
			if(selectedTab.id === 'menu-item-instantimages'){
				instantImagesMediaTab();
			}
		});
		
		// Live Click Handler
		$(document).on('click', '.media-router button.media-menu-item', function(e){
			let selectedTab = activeFrame.querySelector('.media-router button.media-menu-item.active');
			if(selectedTab.id === 'menu-item-instantimages'){
				instantImagesMediaTab();
			}
		});
		
	}
});
