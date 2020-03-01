import React, { Component } from 'react';
import {HomeButton, SignoutButton} from '../elements/Buttons.js';
import SessionInfo from '../tools/ContentData.js';
import CollectionTable from '../elements/CollectionTable';

class Collection extends Component {
  
  // Retrieves the list of items from the Express app

  render() {
    return (
      <div className="App">
        <div>
          <h>{SessionInfo.getSessionUser()}'s Collection:</h>
          <CollectionTable/>
        </div>
            <HomeButton/>
            <SignoutButton/>
      </div>
    );
  }
}

export default Collection;