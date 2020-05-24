const sql = require('./../sql').users

const cs = {}; // Reusable ColumnSet objects.

/*
    This code is adapted from pg-promise-demo: 
    https://github.com/10vernothin/pg-promise-demo/blob/master/JavaScript/db/repos/users.js
    This object class represents a repository of the users table
*/

class UsersRepository {
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp;
        // set-up all ColumnSet objects, if needed:
        createColumnsets(pgp);
    }

    // Creates the table;
    createTable = async () => {
        return this.db.none(sql.create);
    }

    // Drops the table;
    dropTable = async () => {
        return this.db.none(sql.drop);
    }

    // Removes all records from the table;
    truncateTable = async () => {
        return this.db.none(sql.empty);
    }

    // Adds a new user, and returns the new object;
    add = (userObj) => {
        return this.db.any(sql.add, [userObj.username, userObj.email, userObj.pwd]);
    }

    // Tries to delete a user from id, username, or email
    /**
    * @param {id: int=0, username: string='', email: string='', pwd: string=''} searchParams the search parameter JSON object
    * select(searchParams) delete the full user row identified by id, username, or email, then returns the # rows deleted
    **/
    remove = async (searchParams) => {
        const fullParams = Object.assign({}, {id:0, username: '', email: ''}, searchParams)
        return this.db.result(sql.delete,  [fullParams.id, fullParams.username, fullParams.email,], r => r.rowCount);
    }

    // Tries to find a user from id, username, or email
    /**
    * @param {id: int=0, username: string='', email: string='', pwd: string=''} searchParams the search parameter JSON object
    * select(searchParams) returns the full user row identified by id, username, or email
    **/
    select = (searchParams) => {
        const fullParams = Object.assign({}, {id:0, username: '', email: '', pwd: ''}, searchParams)
        return this.db.any(sql.select, [fullParams.id, fullParams.username, fullParams.email, fullParams.pwd]);
    }

    //Lists all the columns in the list
    list = async (columnNamesList) => {
        var columnText = columnNamesList.join()
        return this.db.any(sql.list, columnText)
    }

    // Returns all user records;
    all = async () => {
        return this.db.any(sql.all);
    }

    // Returns the total number of users;
    total = async () => {
        return this.db.one(sql.count, [], a => +a.count);
    }
}

function createColumnsets(pgp) {
    // create all ColumnSet objects only once:
    if (!cs.insert) {
        // Type TableName is useful when schema isn't default "public" ,
        // otherwise you can just pass in a string for the table name.
        const table = new pgp.helpers.TableName({table: 'users', schema: 'public'});

        cs.insert = new pgp.helpers.ColumnSet(['username', 'pwd', 'email'], {table});
        cs.update = cs.insert.extend(['?id']);
    }
    return cs;
}

module.exports = UsersRepository
