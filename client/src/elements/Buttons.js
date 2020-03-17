import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import SessionInfo from '../tools/ContentData.js';

class HomeButton extends Component {
  //Button that links to the Home page
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
    //Button that Signs out and returns to Home page

    signout = () => {
        alert("Signing out");
        SessionInfo.resetSession();
    }

    render() {
      return(<Link to={'./'}><button type= "button" onClick = {() => this.signout()}>Sign Out</button></Link>);
    } 
}

class CollectionButton extends Component {
  //Button that links to the Collections page
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


class CreateCollectionButton extends Component {
  //Button that links to the Create New Collection page
  render() {
    return (<Link to={'./collections?page=create-new-collection'}><button type= "button">Create New Collection</button></Link>);
  }
}

class SelectCollectionButton extends Component {
  //Button that accesses the chosen Collection
  render() {
    return (<button type= "button">Select</button>);
  }
}


class DeleteCollectionButton extends Component {
  //Button that deletes the chosen collection 
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.col_id
    }
  }
  
  deleteCollection = e => {
    e.preventDefault()
    fetch('/api/collections/delete-collection',
    { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({collectionID: this.state.id})
    }
    ).then(
      ()=> {
        this.props.updateState()
      }
    )
  }

  render() {
    return (<button type= "button" onClick={this.deleteCollection}>Delete</button>);
  }
}

class EditCollectionButton extends Component {
  //Button that accesses the chosen Collection for deletion
  render() {
    return (<button type= "button">Edit</button>);
  }
}

class DownloadBulkDataButton extends Component {
  //Button that downloads Scryfall data. Should only be accessed at most once per day, and will be disabled otherwise

  /*Constructor*/
  constructor(props) {
    super(props);
    this.state = {
      disabled: true
    }
  }

  //Checks if the data needs updating. The button will be enabled only if it does needs updating.
  componentDidMount() {
    fetch('/api/fetch-card/check-updateable')
    .then((res) =>{return res.json()})
    .then((ress) => 
      {if (ress === -1) { 
        this.setState({disabled: false});
      } else {
        this.setState({disabled: true});
      }});
  }

  //Changes the button text to reflect status of data
  ButtonTextChange = () => {
    if (!(this.state.disabled)) {
      return "Update Scryfall Data";
    } else {
      return "Data Up to Date"
    }
  }

  render (){
    return (<Link to={'./downloads?func=fetch-card%2Fdownload-bulk-data'}><button type= "button" disabled= {this.state.disabled} >{this.ButtonTextChange()}{this.state.disabled}</button></Link>);
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
  CreateCollectionButton,
  DownloadBulkDataButton
};