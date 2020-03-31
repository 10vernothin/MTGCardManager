import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class SignupButton extends Component {
    //Button that links to the Sign-Up page
    render() {
      return (<Link to={'./signup'}><button type= "button">Sign Up Now!</button></Link>);
    }
}

export {
    SignupButton
}