//Defining a database
var pgp = require('pg-promise') (/*options*/);
var connected = false;
var pgdb;
var fs = require('fs')
var dbDets = fs.readFileSync('./database/db-info.json');

//singleton connection
exports.getConnectionInstance = () => {
    if (!connected) {
        dbDets = JSON.parse(fs.readFileSync('./database/db-info.json'))
        pgdb = pgp(dbDets);
        connected = true;
    }
    return pgdb;
}

exports.refreshConnection = () => {
    connected = false;
    return exports.getConnectionInstance()
}

exports.testConnection = async (newDetObj = dbDets) => {
    pgtest = pgp(newDetObj);
    return (pgtest.connect()
    .then((obj) => {
        obj.done(); // success, release connection;
        pgtest = null
        return true
    })
    .catch((error) => {
        pgtest = null
        return false
    }));
    
}

//testConnection().then((test) => {console.log(test)})

exports.getDetails = (newDetObj) => {
    return dbDets
}

exports.commitDetailsJSON = () => {
    
}

exports.isLoggedIn = () => {
    return loggedIn
}

exports.loggedUser = () => {
    if (loggedIn) {
        return loggedUser;
    } else {
        console.log("Not logged in.");
        return null;
    }
}
