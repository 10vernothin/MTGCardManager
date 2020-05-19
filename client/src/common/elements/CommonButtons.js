import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import SessionInfo from '../cached_data/SessionInfo';

class HomeButton extends Component {
  //Button that links to the Home page
  render() {
      return (<Link to={'./'}><button type= "button">Home</button></Link>);
    }
  }

class SignoutButton extends Component {
  //Button that Signs out and returns to Home page

  signout = e => {
      e.preventDefault();
      if (window.confirm("Are you sure you want to log out?")){
        SessionInfo.resetSession();
        this.props.history.push('./')
      }
  }

  render() {
  return(<button type= "button" onClick = {this.signout}>Sign Out</button>);
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