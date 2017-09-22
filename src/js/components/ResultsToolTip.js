import React from 'react';

class ResultsToolTip extends React.Component {      
   constructor(props) {
      super(props);      
   }   
   render(){      
      return (         
      	<div className={this.props.isSearch ? 'searchResults' : 'searchResults hide'} title={ this.props.title }>
      	   { this.props.total }
         </div>      
      )
   }
}
export default ResultsToolTip;   