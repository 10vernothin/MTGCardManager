//Defining a database
const promise = require('bluebird')
const fs = require('fs')
const defaultDbDets = { "host": "_UNSET", "port": 0, "database": "_UNSET", "user": "_UNSET", "password": "" };
const { Users, Listing, Collection, Cards } = require('./repos')
const pgPromise = require('pg-promise')
const initOptions = {

    // Use a custom promise library, instead of the default ES6 Promise:
    promiseLib: promise,

    // Extending the database protocol with our custom repositories;
    // API: http://vitaly-t.github.io/pg-promise/global.html#event:extend
    extend(obj, dc) {
        // Database Context (dc) is mainly useful when extending multiple databases with different access API-s.

        // Do not use 'require()' here, because this event occurs for every task and transaction being executed,
        // which should be as fast as possible.
        obj.users = new Users(obj, pgp);
        obj.listing = new Listing(obj, pgp);
        obj.collection = new Collection(obj, pgp);
        obj.cards = new Cards(obj, pgp);
    }
};
const configfilepath = './database/metadata/db-info.dat'
const pgp = pgPromise(initOptions);

var connected = false;
var pgdb;
var dbDets;

//singleton connection
exports.getConnectionInstance = (next=undefined, tries = 0, maxTries = 10) => {
    if (tries === maxTries) {
        return null
    }
    if (!connected) {
        try {
            newdbDets =JSON.parse(fs.readFileSync(configfilepath, { encoding: "utf8" }))
        
        } catch (err) {
            if (err.code === 'ENOENT') {
                try {
                    fs.writeFileSync(configfilepath, JSON.stringify(defaultDbDets))
                    newdbDets = JSON.parse(fs.readFileSync(configfilepath, { encoding: "utf8" }))
                } catch (err) {
                    console.log(`ERROR: WRITING FILE FAILED. TRIES(${tries+1}/${maxTries})`)
                    return this.getConnectionInstance(next, tries + 1)
                }
            } else {
                console.log(`ERROR: SOMETHING WENT WRONG. TRIES(${tries+1}/${maxTries})`)
                console.log(err)
                
                return this.getConnectionInstance(next, tries + 1)
            }
        }
        if (!(JSON.stringify(newdbDets) === JSON.stringify(dbDets))) {
            dbDets = newdbDets;
            if (pgdb) {
                pgdb.$pool.end(); //destroys the database singleton object
                pgdb = null
            }
            pgdb = pgp(dbDets);
            this.createExtensions()
            console.log("EXTENSION IMPORTED.")
        }
    }
    this.testConnection(dbDets)
    if (next) {
         next(pgdb)
    } else {
        return pgdb;
    }
}

exports.refreshConnection = (callback=undefined) => {
    connected = false;
    console.log("REFRESHING DB CONNECTION...")
    return exports.getConnectionInstance(callback)
}

exports.testConnection = async (newDetObj = dbDets, check_db_availability = false) => {
    let pgtest;
    let isSelf = false;
    if (JSON.stringify(dbDets) === JSON.stringify(newDetObj)) {
        isSelf = true;
        pgtest = pgdb
        if (connected) {
            return (!check_db_availability) && true
        }
    } else {
        pgtest = pgp(newDetObj);
    }
    try {
        connection = await pgtest.any("select 1")
        if (isSelf) {
            if (!connected) {
                console.log({...dbDets, password: dbDets.password.valueOf().split('').fill('*',1).join('')})
                console.log("DATABASE CONNECTED.")
                connected = true
            }
        } else {
            pgtest.$pool.end(); //destroys the database singleton object
            pgtest = null
        }
        return (!check_db_availability) && true
    } catch (error) {
        console.log(error)
        if (isSelf) {
            if (connected) {
                console.log("WARNING: DATABASE DISCONNECTED")
                connected = false
            }
        } else {
            pgtest.$pool.end(); //destroys the database singleton object
            pgtest = null
        }
        return (error.code === '3D000' && check_db_availability) || false
    }
}

exports.updateDatabaseDetails = async (newDetObj) => {
    return (fs.writeFile(configfilepath, JSON.stringify(newDetObj), (err) => {
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

exports.createNewDatabase = async (dbName) => {
    if (dbName) {
        try {
            var res = await pgdb.any(`CREATE DATABASE "${dbName}"`)
            newdbDets = { ...dbDets };
            newdbDets.database = dbName
            await this.updateDatabaseDetails(newdbDets)
            await this.refreshConnection()
            return (true)
        } catch (err) {
            console.log(err)
            return (false)
        }
    }
}

//Creating the necessary extensions
exports.createExtensions =  async () => {
    console.log("IMPORTING EXTENSIONS...")
    await pgdb.any('CREATE EXTENSION IF NOT EXISTS citext;')
    return null
}

exports.createAllTables = async () => {
    try {
        await (promise.all([pgdb.users.dropTable(), pgdb.cards.dropTable(), pgdb.listing.dropTable(), pgdb.collection.dropTable()]))
        console.log("ALL TABLES DROPPED.")
        await pgdb.users.createTable()
        console.log("USERS CREATED")
        await pgdb.cards.createTable()
        console.log("CARDS CREATED")
        await pgdb.listing.createTable()
        console.log("LISTING CREATED")
        await pgdb.collection.createTable()
        console.log("COLLECTION CREATED");
        console.log('Finished.')
        return true
    } catch (err) {
        console.log(err)
        return false
    }
}

