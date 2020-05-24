const sql = require('../sql').cards

const cs = {}; // Reusable ColumnSet objects.

/*
    This code is adapted from pg-promise-demo: 
    https://github.com/10vernothin/pg-promise-demo/blob/master/JavaScript/db/repos/users.js
    This object class represents a repository of the users table
*/

class CardsRepository {
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

    /**
    * @param {card_name: string, set_code: string, collector_number: string, price: number, foil_price: number} cardObj query Parameters
    * query(cardObj) upsert a new card entry;
    */
    upsert = async (cardObj) => {
        return this.db.any(sql.upsert, [cardObj.card_name, cardObj.set_code, cardObj.collector_number, cardObj.price, cardObj.foil_price]);
    }

    /**
    * @param {nameFragment: string, ?orderBy: columnName='name', ?limit: int=50} searchParams query Parameters
    * query(searchParams) returns a list of max(limit) quere results
    */
    query = async (nameFrag, searchOpts={}) => {
        const params = Object.assign(
            {}, 
            { nameFragment: '', orderBy:'card_name', limit:50 },
            {...searchOpts, nameFragment: nameFrag.replace('\'','\'\'')}
        )
        return this.db.any(sql.query, [`'(\\m${params.nameFragment})'`, params.orderBy, params.limit]);
    }

    /**
    * @param {id: int=0, set_code: string='', collector_number: string=''} selectParams selection Parameters
    * select(selectParams) returns a single object defined (id) or (set_code+collector_number) by if it exists
    **/
    select = async (selectParams) => {
        var fullParams = Object.assign({}, { id: 0, set_code:'', collector_number:''}, selectParams)
        return this.db.any(sql.select, [fullParams.id, fullParams.set_code, fullParams.collector_number])
    }

    remove = async (deleteParams)  => {
        return this.db.any(sql.delete, [deleteParams.set_code, deleteParams.collector_number])
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
        const table = new pgp.helpers.TableName({ table: 'users', schema: 'public' });

        cs.insert = new pgp.helpers.ColumnSet(['set_code', 'collector_number', 'card_name', 'price', 'foil_price'], { table });
        cs.update = cs.insert.extend(['?id']);
    }
    return cs;
}

module.exports = CardsRepository
