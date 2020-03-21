import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {LoginButton, CollectionListButton} from './../../common/elements/common-buttons';
import {DownloadBulkDataButton} from './elements/home-buttons'
import SessionInfo from '../../common/cached_data/session-info';
import PlaneswalkerSymbol from '../../common/images/PlaneswalkerSymbol';

class HomePage extends Component {

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
      return (<CollectionListButton/>)
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
          <Link to={'./userlist'}>
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
export default HomePage;