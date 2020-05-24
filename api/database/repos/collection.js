const sql = require('../sql').collection

const cs = {}; // Reusable ColumnSet objects.

/*
    This code is adapted from pg-promise-demo: 
    https://github.com/10vernothin/pg-promise-demo/blob/master/JavaScript/db/repos/users.js
    This object class represents a repository of the users table
*/

class CollectionRepository {
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

    // Adds a new card to the specific collection;
    add = (addCardObj) => {
        addCardObj = Object.assign({}, {amt:1}, addCardObj)
        return this.db.any(sql.add, [addCardObj.card_id, addCardObj.listing_id, addCardObj.is_foil, addCardObj.amt]);
    }

    // Tries to delete a user by id, and returns the number of records deleted;
    remove = async (removeCardObj) => {
        removeCardObj = Object.assign({}, {amt:1}, removeCardObj)
        return (this.db.task(async t=>{
            const old_amt = await t.any(sql.select, 
            [removeCardObj.card_id, removeCardObj.listing_id, removeCardObj.is_foil])
            if (old_amt[0].amt - removeCardObj.amt > 0) {
                return t.any(sql.update, [removeCardObj.card_id, removeCardObj.listing_id, removeCardObj.is_foil, removeCardObj.amt])
            } else {
                return t.any(sql.delete,  [removeCardObj.card_id, removeCardObj.listing_id, removeCardObj.is_foil, removeCardObj.amt]);
            }
        }))
        
    }

    // Tries to find a user from id, username, or email
    fetchCollection = (id) => {
        return this.db.any(sql.fetchcollection, id);
    }

    download = async (id) => {
        return this.db.any(sql.download, id);
    }

    //Lists all the columns
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
        const table = new pgp.helpers.TableName({table: 'cards', schema: 'public'});

        cs.insert = new pgp.helpers.ColumnSet(['card_id', 'amt', 'listing_id', 'is_foil'], {table});
        cs.update = cs.insert.extend(['?id']);
    }
    return cs;
}

module.exports = CollectionRepository