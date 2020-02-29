import React, { Component } from 'react';
import { Link } from 'react-router-dom';

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
    //Button that links to the Sign-Up page
    constructor(props) {
        super(props);
        this.state = {
            disable: true
        }
    }

    signout = () => {
        fetch('/api/logout');
    }
    
    render() {
      return(<button type= "button" onClick = {this.signout()} disabled={this.state.disable}>Sign Out.</button>);
    } 
}

export { HomeButton, SignupButton, SignoutButton };