var fs = require('fs').promises;
var _db = require('../database/database');
var pgdb = _db.getConnectionInstance();
path = "../api/json/scryfall/cards"

/*This now uses postgreSQL*/
exports.fetchAllCards = async (orderby = 'name', limit = 50) => {
        return await pgdb.any(`SELECT * from cards order by ${orderby} LIMIT ${limit}`).catch((err) => {
            console.log(err.message);
            err = null;
        });
}

/*Subcontainer so this function can be chained to refine results. E.g. C->Co->Cob->Cobr...*/
exports.queryCardList = async (nameFragment, orderby = 'name', limit = 50) => {
    res = await pgdb.any(`SELECT * from cards where name ~* '(\\m${nameFragment})' order by ${orderby} LIMIT ${limit}`).catch((err) => {
        console.log("Database Error:", err);
        err = null;
    }).catch((err)=> {console.log(err)});
    return res.filter(item => item.name.toLowerCase().includes(nameFragment.toLowerCase()))
}

exports.selectCardJSONData = async (set, set_id) => {
    res = await pgdb.any('SELECT * from cards where set_id = $1 and set = $2', [set_id, set]).catch((err) => {
        console.log(err.message);
        err = null;
    });
    //console.log(res);
    if (res.length == 0) {
        return null;
    } else {
        cardpath = path.concat('/').concat(res[0].set).concat('/').concat(res[0].set_id.replace('*', '_star')).concat('.json')
        //console.log(cardpath);
        return JSON.parse(await fs.readFile(cardpath, "utf-8"));
    }
}

exports.selectCardJSONDataByCardID = async (id) => {
    res = await pgdb.any(`SELECT * from cards where id = ${id}`).catch((err) => {
        console.log(err.message);
        err = null;
    });
    if (res.length == 0) {
        return null;
    } else {
        cardpath = path.concat('/').concat(res[0].set).concat('/').concat(res[0].set_id.replace('*', '_star')).concat('.json')
        return JSON.parse(await fs.readFile(cardpath, "utf-8"));
    }
}

exports.selectCardJSONDataInBulk = async (nameFragment) => {
    sets = await this.queryCardList(nameFragment)
    lst = []
    sets.map((items) => {
        obj = this.selectCardJSONData(items.set, items.set_id)
        lst.push(obj)
    })
    return lst
}

exports.selectCardJSONDataByIDInBulk = async (lstIDs) => {
    lstIDs.map((id) => {
        obj = this.selectCardJSONDataByCardID(id)
        lst.push(obj)
    })
    return lst
}

exports.getPreviews = async (nameFragment) => {
    lst = await Promise.all(await this.selectCardJSONDataInBulk(nameFragment));
    list = lst.map( (JSONCardObj) => {
            return `${JSONCardObj.name} [${(JSONCardObj.set).toUpperCase()}]`;
        }
    )
    return list;
}

exports.getDetailedPreviews = async (nameFragment) => {
    lst = await Promise.all(await this.selectCardJSONDataInBulk(nameFragment));
    list = lst.map( (JSONCardObj) => {
            return {"name": JSONCardObj.name, "mana_cost": JSONCardObj.mana_cost, "set_name": JSONCardObj.set_name, 
            "set": JSONCardObj.set,
            "set_id": JSONCardObj.set_id,
            "foil": JSONCardObj.foil,
            "nonfoil": JSONCardObj.nonfoil,
            "prices": JSONCardObj.prices};
        }
    )
    return list;
}

exports.getPrices = async (nameFragment) => {
    lst = await Promise.all(await this.selectCardJSONDataInBulk(nameFragment));
    list = lst.map( (JSONCardObj) => {
            return JSONCardObj.prices;
        }
    )
    return list;
}

exports.createCollectionList = async (lstIDs) => {
    lst = await Promise.all(await this.selectCardJSONDataInBulk(lstIDs));
    if (lst.length === 0) {
        return []
    } else {
        list = lst.map( (JSONCardObj) => {
                return `"${JSONCardObj.name} [${(JSONCardObj.set).toUpperCase()}]"`;
            }
        )
    }
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