import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {LoginButton, CollectionButton, DownloadBulkDataButton} from '../elements/Buttons';
import SessionInfo from '../tools/ContentData.js';
import PlaneswalkerSymbol from '../images/PlaneswalkerSymbol'

class Home extends Component {

  WelcomeUser() {
      //alert(SessionInfo.getSessionUser());
      if (!(SessionInfo.getSessionUser() === '')) {
        return (<h1> Welcome {SessionInfo.getSessionUser()} </h1>)
      } else {
        return null;
      }
  }

  SwitchLoginCollectionButtons() {
    if (SessionInfo.getSessionStatus() === true) {
      return (<CollectionButton/>)
    } else {
      return <LoginButton/>
    }
  }


  render() {
    return (
    <div className="App">
        <div><h1>MTG Card Manager</h1></div>
        <div>{this.WelcomeUser()}</div>
        <div><PlaneswalkerSymbol/></div>
        <div>
          <Link to={'./list'}>
            <button variant="raised">
                Users
            </button>
          </Link>
          {this.SwitchLoginCollectionButtons()}
          <DownloadBulkDataButton/>
        </div>
    </div>
    );
  }
}
export default Home;