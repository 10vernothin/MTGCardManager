import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import SessionInfo from '../tools/ContentData.js';

class HomeButton extends Component {
    render() {
      return (<Link to={'./'}><button type= "button">Home</button></Link>);
    }
  }

class SignupButton extends Component {
    //Button that links to the Sign-Up page
    render() {
      return (<Link to={'./signup'}><button type= "button">Sign Up Now!</button></Link>);
    }
}

class SignoutButton extends Component {
    //Button that Signs out and returns to homepage

    signout = () => {
        alert("Signing out");
        SessionInfo.resetSession();
    }

    render() {
      return(<Link to={'./'}><button type= "button" onClick = {() => this.signout()}>Sign Out</button></Link>);
    } 
}

class CollectionButton extends Component {
  //Button that links to the Sign-Up page
  render() {
    return (<Link to={'./collections?page=default'}><button type= "button">Your Collections</button></Link>);
  }
}

class LoginButton extends Component {
  render() {
    return (<Link to={'./login'}><button type= "button">Login</button></Link>);
  }
}

class CreateCollectionButton extends Component {
  render() {
    return (<Link to={'./collections?page=create-new-collection'}><button type= "button">Create New Collection</button></Link>);
  }
}

class SelectCollectionButton extends Component {
  render() {
    return (<button type= "button">Select</button>);
  }
}

class DeleteCollectionButton extends Component {
  render() {
    return (<button type= "button">Delete</button>);
  }
}

class EditCollectionButton extends Component {
  render() {
    return (<button type= "button">Edit</button>);
  }
}

export {  
  DeleteCollectionButton,
  SelectCollectionButton, 
  EditCollectionButton,
  HomeButton, 
  SignupButton, 
  SignoutButton, 
  CollectionButton, 
  LoginButton, 
  CreateCollectionButton
};