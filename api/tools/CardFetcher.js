var fs = require('fs').promises;
var _db = require('../database/database');
var pgdb = _db.getConnectionInstance();
var path = "../api/json/scryfall/cards"

/*This now uses postgreSQL*/
exports.fetchAllCards = async (orderby = 'name', limit = 50) => {
        return await pgdb.any(`SELECT * from cards order by ${orderby} LIMIT ${limit}`).catch((err) => {
            console.log(err.message);
            err = null;
        });
}

/*Subcontainer so this function can be chained to refine results. E.g. C->Co->Cob->Cobr...*/
exports.queryCardList = async (nameFragment, orderby = 'name', limit = 100) => {
    let res = await pgdb.any(`SELECT * from cards where name ~* '(\\m${nameFragment})' order by ${orderby} LIMIT ${limit}`).catch((err) => {
        console.log("Database Error:", err);
        err = null;
    }).catch((err)=> {console.log(err)});
    //console.log(res)
    return res
}

exports.selectCardJSONData = async (set, set_id) => {
    let cardpath = path.concat('/').concat(set).concat('/').concat(set_id.replace('*', '_star')).concat('.json')
    //console.log(cardpath);
    let res = await pgdb.any(`SELECT id from cards where set = $1 and set_id = $2`, [set, set_id]).catch((err) => {
        console.log(err.message);
        err = null;
    });
    let obj = JSON.parse(await fs.readFile(cardpath, "utf-8"));
    obj.card_id = res[0].id
    return (obj)
}

exports.selectCardJSONDataByCardID = async (id) => {
    let res = await pgdb.any(`SELECT * from cards where id = ${id}`).catch((err) => {
        console.log(err.message);
        err = null;
    });
    if (res.length == 0) {
        return null;
    } else {
        let cardpath = path.concat('/').concat(res[0].set).concat('/').concat(res[0].set_id.replace('*', '_star')).concat('.json')
        let item = JSON.parse(await fs.readFile(cardpath, "utf-8"))
        item.card_id = id;
        //console.log(item)
        return item;
    }
}

exports.selectCardJSONDataInBulk = async (variable, opts = {type: 'string'}) => {
    let sets;
    if (opts.type == 'string'){
        sets = await this.queryCardList(variable)
    } else {
        sets = variable
    }
    let lst = []
    if (sets === undefined) {
        return lst;
    }
    sets.map((item) => {
        if (opts.type == 'string'){
            obj = this.selectCardJSONData(item.set, item.set_id)
        } else {
            obj = this.selectCardJSONDataByCardID(item)
        }
        lst.push(obj)
    })
    return lst
}


exports.getPreviews = async (nameFragment, opts = {type: 'string'}) => {
    lst = await Promise.all(await this.selectCardJSONDataInBulk(nameFragment, opts));
    list = lst.map( (JSONCardObj) => {
            return ({
                    name: JSONCardObj.name,
                    set_id: JSONCardObj.collector_number,
                    set: JSONCardObj.set,
                    set_name: JSONCardObj.set_name,
                    prices: JSONCardObj.prices,
                    foil: JSONCardObj.foil,
                    nonfoil: JSONCardObj.nonfoil,
                    image_uris: JSONCardObj.image_uris,
                    card_id: JSONCardObj.card_id
                });
            })
    return list;
}

exports.getDetails = async (nameFragment, opts = {type: 'string'}) => {
    lst = await Promise.all(await this.selectCardJSONDataInBulk(nameFragment, opts));
    list = lst.map( (JSONCardObj) => {
            JSONCardObj.set_id = JSONCardObj.collector_number;
            return JSONCardObj
        }
    )
    return list;
}

exports.getID = async (set, set_id) => {
    res = await pgdb.any('SELECT id from cards where set_id = $1 and set = $2', [set_id, set]).catch((err) => {
        console.log(err.message);
        err = null;
    });
    //console.log(res);
    if (res.length == 0) {
        return null;
    } else {
        return res[0];
    }
}