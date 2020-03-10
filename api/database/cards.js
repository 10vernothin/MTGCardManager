var fs = require('fs');
var _db = require('../database/database');
var pgdb = _db.getConnectionInstance();

/*This currently uses local JSON storage instead of postgreSQL*/
exports.fetchAllCards = async (orderby = 'name') => {
        return await pgdb.any(`SELECT * from cards order by ${orderby}`).catch((err) => {
            console.log(err.message);
            err = null;
        });
}

/*Subcontainer so this function can be chained to refine results. E.g. C->Co->Cob->Cobr...*/
exports.queryCardList = async (nameFragment, subcontainer = this.fetchAllCards()) => {
    return (await subcontainer).filter(item => item.name.toLowerCase().includes(nameFragment.toLowerCase()))
}

exports.selectExactCard = (setID, set, subcontainer = this.fetchCards()) => {
    return subcontainer.filter(item => item.collector_number == setID && item.set == set)[0];
}
