//Defining a database
var pgp = require('pg-promise') (/*options*/);
var dbDets = require('./db-info.js');
var connected = false;
var pgdb;
var loggedIn = false;
var loggedUser = '';

//singleton connection
exports.getConnectionInstance = () => {
    if (!connected) {
        connected = true;
        pgdb = pgp(dbDets);
    }
    return pgdb;
}

exports.isLoggedIn = () => {
    return loggedIn
}

exports.loggedUser = () => {
    if (loggedIn) {
        return loggedUser;
    } else {
        Console.log("Not logged in.");
        return null;
    }
}

exports.login = (user) => {
    loggedIn = true;
    loggedUser = user;
}

