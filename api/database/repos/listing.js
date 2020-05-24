const sql = require('./../sql').listing

const cs = {}; // Reusable ColumnSet objects.

/*
    This code is adapted from pg-promise-demo: 
    https://github.com/10vernothin/pg-promise-demo/blob/master/JavaScript/db/repos/users.js
    This object class represents a repository of the users table
*/

class ListingRepository {
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

    // Adds a new collection and returns the name
    add = (listObj) => {
        return this.db.any(sql.add, 
            [
                listObj.user_id, 
                listObj.collection_name, 
                listObj.description,
                (listObj.showcase_card_id || listObj.showcase_card_id === 0 || listObj.showcase_card_id === '')? listObj.showcaseCardID:null
            ]);
    }

    // Tries to delete a user by id, and returns the number of records deleted;
    remove = async (id) => {
        return this.db.result(sql.delete,  [id], r => r.rowCount);
    }

    // Update object
    update = (id, updateObject) => {
        var rawSetStringList = []
        Object.keys(updateObject).forEach((key) => {
            if(typeof updateObject[key] === 'number') {
                rawSetStringList.push(` ${key} = ${updateObject[key]}`)
            } else if (!(updateObject[key])) {     
            } else {
                rawSetStringList.push(` ${key} = '${updateObject[key].replace('\'', '\'\'')}'`)
            }
        })
        return this.db.any(sql.update, [rawSetStringList.join(), id]);
    }

    // Fetching all the collections
    fetchList = async (id) => {
        return this.db.any(sql.fetchlist, id)
    }

    select = async (id) => {
        return this.db.any(sql.select, id)
    }

    listColumns = async (columnNamesList) => {
        var columnText = columnNamesList.join()
        return this.db.any(sql.list, columnText)
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
        const table = new pgp.helpers.TableName({table: 'listing', schema: 'public'});

        cs.insert = new pgp.helpers.ColumnSet(['users_id', 'collection_name', 'description', 'showcase_card_id'], {table});
        cs.update = cs.insert.extend(['?id']);
    }
    return cs;
}

module.exports = ListingRepository
