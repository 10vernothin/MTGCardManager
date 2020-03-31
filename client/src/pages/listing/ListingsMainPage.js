import React, { Component } from 'react';
import {HomeButton, SignoutButton} from '../../common/elements/CommonButtons';
import {CreateCollectionButton} from './elements/Buttons'
import ListingsTable from './elements/ListingsTable';
import SessionInfo from '../../common/cached_data/SessionInfo';

class ListingsMainPage extends Component {
  
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
          <ListingsTable updateState={this.updateState}/>
        <div>
            <HomeButton/>
            <SignoutButton/>
            <CreateCollectionButton/>
        </div>
      </div>
    );
  }
}

export default ListingsMainPage;