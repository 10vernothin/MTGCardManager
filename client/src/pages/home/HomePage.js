import React, { Component } from 'react';
import {LoginButton, CollectionListButton} from '../../common/elements/CommonButtons';
import {DownloadBulkDataButton, UserListButton} from './elements/Buttons'
import SessionInfo from '../../common/cached_data/SessionInfo';
import PlaneswalkerSymbol from './elements/PlaneswalkerSymbol';
import './css/Home.css'

class HomePage extends Component {

  render() {
    return (
    <div class='home_page'>
        <div><h1>MTG Card Manager</h1></div>
        <div>{this.renderWelcomeUser()}</div>
        <div><PlaneswalkerSymbol/></div>
        <div>
          <UserListButton/>
          {this.renderLoginCollectionButton()}
          <DownloadBulkDataButton/>
        </div>
    </div>
    );
  }

  //Render functions

  renderWelcomeUser() {
      //alert(SessionInfo.getSessionUser());
      if (!(SessionInfo.getSessionUser() === '')) {
        return (<h1> Welcome {SessionInfo.getSessionUser()} </h1>)
      } else {
        return null;
      }
  }

  renderLoginCollectionButton() {
    if (SessionInfo.getSessionStatus() === true) {
      return (<CollectionListButton/>)
    } else {
      return <LoginButton/>
    }
  }
  
}
export default HomePage;