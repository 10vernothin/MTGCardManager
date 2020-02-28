import React from 'react';

export const loggedIn = {
  "true": true,
  "false": false
};

export const LoggedInContext = React.createContext( {
  Logged: loggedIn.false,
  LoggedUser: ''
}
);
