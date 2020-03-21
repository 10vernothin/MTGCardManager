import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import SessionInfo from '../cached_data/session-info';

class HomeButton extends Component {
  //Button that links to the Home page
  render() {
      return (<Link to={'./'}><button type= "button">Home</button></Link>);
    }
  }

class SignoutButton extends Component {
  //Button that Signs out and returns to Home page

  signout = () => {
      alert("Signing out");
      SessionInfo.resetSession();
  }

  render() {
    return(<Link to={'./'}><button type= "button" onClick = {() => this.signout()}>Sign Out</button></Link>);
  } 
}

class CollectionListButton extends Component {
  //Button that links to the CollectionsList page
  render() {
    return (<Link to={'./collections?page=default'}><button type= "button">Your Collections</button></Link>);
  }
}

class LoginButton extends Component {
  //Button the links to the Login page
  render() {
    return (<Link to={'./login'}><button type= "button">Login</button></Link>);
  }
}


export {  
  HomeButton,
  SignoutButton, 
  CollectionListButton, 
  LoginButton
};