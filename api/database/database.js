//Defining a database
var pgp = require('pg-promise') (/*options*/);
var connected = false;
var pgdb = null;
var fs = require('fs')
const defaultDbDets = {"host":"_UNSET","port":0,"database":"_UNSET","user":"_UNSET","password":""};
var dbDets;


//singleton connection
exports.getConnectionInstance = () => {
    if (!connected) {
        try {
            dbDets = JSON.parse(fs.readFileSync('./database/db-info.dat', {encoding: "utf8"}))
        } catch(err) {
            if (err.code === 'ENOENT') {
                fs.writeFileSync('./database/db-info.dat', JSON.stringify(defaultDbDets))
                dbDets = JSON.parse(fs.readFileSync('./database/db-info.dat', {encoding: "utf8"}))
            }
        }
        if (this.testConnection(dbDets)){
            pgdb = pgp(dbDets);
            connected = true;
        }
        return pgdb;
        
    }
   
}

exports.refreshConnection = () => {
    connected = false;
    console.log("REFRESHING DB CONNECTION...")
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

exports.updateDatabaseDetails = async (newDetObj) => {
    return (fs.writeFile('./database/db-info.dat', JSON.stringify(newDetObj), (err) => {
        this.refreshConnection()
        return err
    }))
}

//testConnection().then((test) => {console.log(test)})

exports.getDetails = () => {
    this.getConnectionInstance()
    return dbDets;
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
