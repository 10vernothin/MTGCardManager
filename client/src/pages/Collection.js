import React, { Component } from 'react';
import {HomeButton, SignoutButton, CreateCollectionButton} from '../elements/Buttons.js';
import SessionInfo from '../tools/ContentData.js';
import CollectionTable from '../elements/CollectionTable';

class Collection extends Component {
  
  // Retrieves the list of items from the Express app

  constructor(props) {
    super(props)
    this.state=({
      loading: ''
    })
    this.updateState.bind(this)
  }

  
  updateState = () => {
    //alert("Updating top")
    this.setState({
      loading: "..."
    })
  }

  render() {
    return (
      <div className="App">
        <div>
          <h1>{SessionInfo.getSessionUser()}'s Collection:</h1>
        </div>
          <CollectionTable updateState={this.updateState}/>
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