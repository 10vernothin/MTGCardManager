import React, { Component } from 'react';
import {HomeButton, SignoutButton, CreateCollectionButton} from '../elements/Buttons.js';
import SessionInfo from '../tools/ContentData.js';
import CollectionTable from '../elements/CollectionTable';

class Collection extends Component {
  
  // Retrieves the list of items from the Express app

  render() {
    return (
      <div className="App">
        <div>
          <h1>{SessionInfo.getSessionUser()}'s Collection:</h1>
        </div>
          <CollectionTable/>
        <div>
            <HomeButton/>
            <SignoutButton/>
            <CreateCollectionButton/>
        </div>
      </div>
    );
  }
}

export default Collection;