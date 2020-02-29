import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Collection extends Component {
  
  // Retrieves the list of items from the Express app

  render() {
    return (
      <div className="App">
        <div>
          <h>Your Collection:</h>
        </div>
            <Link to={'./'}><button type= "button">Exit</button></Link>
      </div>
    );
  }
}

export default Collection;