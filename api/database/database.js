//Defining a database
var pgp = require('pg-promise')(/*options*/);
var connected = false;
var fs = require('fs')
const defaultDbDets = { "host": "_UNSET", "port": 0, "database": "_UNSET", "user": "_UNSET", "password": "" };
var pgdb = pgp(defaultDbDets);
var dbDets;


//singleton connection
exports.getConnectionInstance = (tries=0) => {
    if (!connected) {
        try {
            newdbDets = JSON.parse(fs.readFileSync('./database/db-info.dat', { encoding: "utf8" }))
        } catch (err) {
            if (err.code === 'ENOENT') {
                try {
                    fs.writeFileSync('./database/db-info.dat', JSON.stringify(defaultDbDets))
                    newdbDets = JSON.parse(fs.readFileSync('./database/db-info.dat', { encoding: "utf8" }))
                } catch (err) {
                    console.log("ERROR: WRITING FILE FAILED.")
                    return null
                }
            } else {
                console.log("ERROR: SOMETHING WENT WRONG")
                console.log(err)
                return null
            }
        }
        if (!(JSON.stringify(newdbDets) === JSON.stringify(dbDets))){
            dbDets = newdbDets;
            pgdb = pgp(dbDets);
        }
    }
    this.testConnection(dbDets)
    return pgdb;
}

exports.refreshConnection = () => {
    connected = false;
    console.log("REFRESHING DB CONNECTION...")
    return exports.getConnectionInstance()
}

exports.testConnection = async (newDetObj = dbDets) => {
    let pgtest;
    let isSelf = false;
    if (JSON.stringify(dbDets) === JSON.stringify(newDetObj)) {
        isSelf = true;
        pgtest = pgdb
        if (connected) {
            return true
        }
    } else {
        pgtest = pgp(newDetObj);
    }

    return (pgtest.connect()
        .then((obj) => {
            if (isSelf) {
                if (!connected) {
                    console.log("DATABASE CONNECTED.")
                    connected = true
                }
            }
            obj.done(); // success, release connection;
            pgtest = null
            return true
        })
        .catch((error) => {
            pgtest = null
            if (isSelf) {
                if (connected) {
                    console.log("WARNING: DATABASE DISCONNECTED")
                    connected = false
                }
            }
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
