
import React, { Component } from 'react';
import {LoggedInContext, loggedIn} from './LoggedIn';


class LoginProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Logged: loggedIn.false,
            LoggedUser: ''
        }
    }
    
    render() {
        return (
            <LoggedInContext.Provider 
                value = {{
                   Logged : this.Logged,
                   LoggedUser: this.LoggedUser,
                   LoggingIn : (name) => {
                       this.setState( {
                            Logged : loggedIn.true,
                            LoggedUser: name
                       })
                   },
                   LoggingOut : (name) => {
                    this.setState( {
                         Logged : loggedIn.false,
                         LoggedUser: ''
                        }
                    )}
                }}>
                    {this.props.children}
                </LoggedInContext.Provider>
                )
        }
}

export default LoginProvider;