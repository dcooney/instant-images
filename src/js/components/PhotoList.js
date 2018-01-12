import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import imagesloaded from 'imagesloaded';
import Photo from './Photo'; 
import ResultsToolTip from './ResultsToolTip'; 
import API from './API';
 
class PhotoList extends React.Component {
	
	constructor(props) {
      super(props);
      
      this.state = { results: this.props.results }; 
      
      this.results = this.props.results;	   
      this.service = this.props.service; // Unsplash, Pixabay, etc.
      this.orderby = this.props.orderby; // Orderby
      this.page = this.props.page; // Page
      
      this.is_search = false;
      this.search_term = '';
      this.total_results = 0;
      
      this.isLoading = false; // loading flag
      this.isDone = false; // Done flag - no photos remain
      
      this.errorMsg = '';
      this.msnry = '';
      this.container = document.querySelector('.instant-img-container');
      this.container.classList.add('loading');
      this.wrapper = document.querySelector('.instant-images-wrapper');
      
   }
   
   
   
   /*
	 * search()
	 * Trigger Unsplash Search
	 * 
	 * @param e   element    the search form  
	 * @since 3.0 
	 */
   search(e){
      
	   e.preventDefault();
	   let input = document.querySelector('#photo-search');
	   let term = input.value;
	   
	   if(term.length > 2){		   
		   input.classList.add('searching');
		   this.container.classList.add('loading');
		   this.search_term = term;
		   this.is_search = true;
		   this.doSearch(this.search_term);		   
	   } else {		   
		   input.focus();		   
	   }
	   
   } 
   
   
   
   /*
	 * doSearch
	 * Run the search
	 * 
	 * @param term   string    the search term  
	 * @param type   string    the type of search, standard or by ID    
	 * @since 3.0
	 * @updated 3.1   
	 */
   doSearch(term){
      
      let self = this;
      let type = 'term';
      this.page = 1; // reset page num
      
	   let url = `${API.search_api}${API.app_id}${API.posts_per_page}&page=${this.page}&query=${this.search_term}`;	  
	   
	   // Search by ID
	   // allow users to search by photo by prepending id:{photo_id} to search terms
	   let search_type = term.substring(0, 3);	   
	   if(search_type === 'id:'){		   
		   type = 'id';
		   term = term.replace('id:', '');
   	   url = `${API.photo_api}/${term}${API.app_id}`;   	   
	   }

      let input = document.querySelector('#photo-search');
      
	   fetch(url)
	      .then((data) => data.json())
         .then(function(data) {            
            
            // Term Search
            if(type === 'term'){
	         
   	         self.total_results = data.total;
   	         
   	         // Check for returned data
   	         self.checkTotalResults(data.results.length);
   	         
   	         // Update Props
   	         self.results = data.results;
   	         self.setState({ results: self.results });   	         
	         
	         }
	         
	         // Search by photo ID
	         if(type === 'id' && data){
   	         
   	         // Convert return data to array   	         
   	         let photoArray = [];   	         
   	         
   	         if(data.errors){ // If error was returned
	   	         
	   	         self.total_results = 0;        
	   	         self.checkTotalResults('0');
	   	         
	   	      } else { // No errors, display results
		   	      
	   	         photoArray.push(data);
	   	         
	   	         self.total_results = 1;   	         
	   	         self.checkTotalResults('1');
	   	         
   	         }
   	         
   	         self.results = photoArray;
   	         self.setState({ results: self.results });
            }
	         
	         input.classList.remove('searching');	
	         		      
	      })
	      .catch(function(error) {
            console.log(error);
            self.isLoading = false;
         });
		      
   }
   
   
   
   /*
	 * clearSearch
	 * Reset search results and results view  
	 * 
	 * @since 3.0
	 */
   clearSearch(){
      let input = document.querySelector('#photo-search');
		input.value = '';
      this.total_results = 0;
      this.is_search = false;
      this.search_term = '';
   }
   
   
   
   /*
	 * loadMorePhotos
	 * Load next set of photos, infinite scroll style  
	 *
	 * @since 3.0
	 */
   loadMorePhotos(){
      
		let self = this;
	   this.page = this.page + 1;
      this.container.classList.add('loading');
      this.isLoading = true;
	      
	   let url = `${API.photo_api}${API.app_id}${API.posts_per_page}&page=${this.page}&order_by=${this.orderby}`;
	   if(this.is_search){
		   url = `${API.search_api}${API.app_id}${API.posts_per_page}&page=${this.page}&query=${this.search_term}`;
	   }
	   
		fetch(url)
	      .then((data) => data.json())
         .then(function(data) {
	         
	         if(self.is_search){
	            data = data.results; // Search results are recieved in different JSON format
	         }
	         
	         // Loop results, push items into array
	         data.map( data => { 
		         self.results.push(data); 
		      });
		      
		      // Check for returned data
		      self.checkTotalResults(data.length);
		      
		      // Update Props
	         self.setState({ results: self.results });
		      
	      })
	      .catch(function(error) {
            console.log(error);
            self.isLoading = false;
         });
	      
   } 
   
   
   
   /*
	 * togglePhotoList
	 * Toogles the photo view (New/Popular/Old)
	 * 
	 * @param view   string    Current view  
	 * @param e      element   Clicked element    
	 * @since 3.0
	 */
   togglePhotoList(view, e){
      
	   let el = e.target;
	   if(el.classList.contains('active')) return false; // exit if active
	   
		el.classList.add('loading'); // Add class to nav btn	
		this.isLoading = true;	
		let self = this;
	   this.page = 1;
	   this.orderby = view;
	   this.results = [];	   
	   this.clearSearch();
	 
	   let url = `${API.photo_api}${API.app_id}${API.posts_per_page}&page=${this.page}&order_by=${this.orderby}`;
		fetch(url)
	      .then((data) => data.json())
         .then(function(data) {
		      
		      // Check for returned data
		      self.checkTotalResults(data.length);
		      
	         // Update Props
	         self.results = data;
	         self.setState({ results: data });
	         
	         el.classList.remove('loading'); // Remove class from nav btn
	      })
	      .catch(function(error) {
            console.log(error);
            self.isLoading = false;
         });
   } 
      
   
   
   /*
	 * renderLayout
	 * Renders the Masonry layout  
	 * 
	 * @since 3.0
	 */
   renderLayout() {
	   let self = this;	   
	   let photoListWrapper = document.querySelector('#photos');	   
      imagesLoaded(photoListWrapper,  function() {         	      
			self.msnry = new Masonry( photoListWrapper, {
				itemSelector: '.photo'
			});         
			[...document.querySelectorAll('#photos .photo')].forEach(el => el.classList.add('in-view'));
      });
   }
   
   
   
   /*
	 * onScroll
	 * Scrolling function 
	 *  
	 * @since 3.0
	 */
   onScroll(){      
      let wHeight = window.innerHeight;
      let scrollTop = window.pageYOffset;
      let scrollH = document.body.scrollHeight - 200;
      if ((wHeight + scrollTop) >= scrollH && !this.isLoading && !this.isDone) {
		   this.loadMorePhotos();		
		}      
   }
   
   
   
   /*
	 * checkTotalResults
	 * A checker to determine is there are remaining search results.
	 * 
	 * @param num   int    Total search results    
	 * @since 3.0
	 */
   checkTotalResults(num){
      this.isDone = (num == 0) ? true : false;
   }
   
   
   
   /*
	 * setActiveState
	 * Sets the main navigation active state  
	 *
	 * @since 3.0
	 */   
   setActiveState(){
      let self = this;
	   // Remove .active class
		[...document.querySelectorAll('.control-nav a')].forEach(el => el.classList.remove('active'));

	   // Set active item, if not search
	   if(!this.is_search){
	   	let active = document.querySelector(`.control-nav li a.${this.orderby}`);
	   	active.classList.add('active');
   	}
   	setTimeout(function(){
      	self.isLoading = false;
      	self.container.classList.remove('loading');
      }, 1000);
   }
   
   
   
   // Component Updated 
   // https://facebook.github.io/react/docs/react-component.html
   componentDidUpdate() {
      this.renderLayout();
      this.setActiveState();
   }
   
   
   
   // Component Init  
   // https://facebook.github.io/react/docs/react-component.html
   componentDidMount() {   
      this.renderLayout();
      this.setActiveState(); 
      this.container.classList.remove('loading');
      this.wrapper.classList.add('loaded');
      window.addEventListener('scroll', () => this.onScroll()); // Add scroll event
      
   }   
 
 
   
   render(){	
       
      return (
         <div id="photo-listing" className={this.service}>
         	
				<ul className="control-nav">
					<li><a className="latest" href="javascript:void(0);" onClick={(e) => this.togglePhotoList('latest', e)}>{ instant_img_localize.latest }</a></li>
					<li id="nav-target"><a className="popular" href="javascript:void(0);" onClick={(e) => this.togglePhotoList('popular', e)}>{ instant_img_localize.popular }</a></li>
					<li><a className="oldest" href="javascript:void(0);" onClick={(e) => this.togglePhotoList('oldest', e)}>{ instant_img_localize.oldest }</a></li>
					<li className="search-field" id="search-bar">
   					<form onSubmit={(e) => this.search(e)} autoComplete="off">
   						<input type="search" id="photo-search" placeholder={ instant_img_localize.search } />
   						<button type="submit" id="photo-search-submit"><i className="fa fa-search"></i></button>	
   						<ResultsToolTip isSearch={ this.is_search } total={ this.total_results } title={ this.total_results + ' ' + instant_img_localize.search_results + ' ' + this.search_term } />			
                  </form>                                    
					</li>
				</ul>
				
            <div id="photos">               
            	{this.state.results.map((result, iterator) =>
						<Photo result={result} key={result.id+iterator} />
					)}
				</div>
				
				<div className={this.total_results == 0 && this.is_search === true ? 'no-results show' : 'no-results'} title={ this.props.title }>
					<h3>{ instant_img_localize.no_results } </h3>
					<p>{ instant_img_localize.no_results_desc } </p>
				</div>
				
				<div className="loading-block" />
				
				<div className="load-more-wrap">
					<button type="button" className="button" onClick={() => this.loadMorePhotos()}>{ instant_img_localize.load_more }</button>
				</div>
				
         </div>
      )
   }
}

export default PhotoList;