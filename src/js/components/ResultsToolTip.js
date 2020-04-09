import React from 'react';

class ResultsToolTip extends React.Component {      
   constructor(props) {
      super(props);      
   }   
   
   
   resetSearch(){
      let nav = document.querySelector('.control-nav');
      let navItem = nav.querySelector('li button.latest');
      navItem.click();
   }
   
   
   render(){      
      return (         
      	<div className={this.props.isSearch ? 'searchResults' : 'searchResults hide'}>
      	   <span title={ this.props.title }>
      	      { this.props.total } 
      	   </span>
      	   <button type="button" title={instant_img_localize.clear_search} onClick={(e) =>this.resetSearch()}>x</button>
         </div>      
      )
   }
}
export default ResultsToolTip;   