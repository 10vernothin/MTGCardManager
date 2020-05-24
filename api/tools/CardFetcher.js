var fs = require('fs').promises;
var dbModule = require('../database/database');
var path = "../api/json/scryfall/cards"

/*Subcontainer so this function can be chained to refine results. E.g. C->Co->Cob->Cobr...*/
exports.queryCardList = async (nameFragment, orderby = 'card_name', limit = 100) => {

    //console.log(nameFragment)
    try {
        var res = await dbModule.getConnectionInstance().cards.query(nameFragment, { orderBy: orderby, limit: limit })
        return res
    } catch (err) {
        console.log("Database Error:", err);
        err = null;
    }
}

exports.fetchCardObjectData = async (set, set_id) => {
    var cardpath = path.concat('/').concat(set).concat('/').concat(set_id.replace('*', '_star')).concat('.json')
    //console.log(cardpath);
    var res = await dbModule.getConnectionInstance().cards.select({set_code:set, collector_number: set_id}).catch((err) => {
        console.log(err.message);
        err = null;
    });
    var obj = JSON.parse(await fs.readFile(cardpath, "utf-8"));
    obj.card_id = res[0].id
    return (obj)
}

exports.fetchCardObjectDataByID = async (id) => {
    var res = await dbModule.getConnectionInstance().cards.select({id:id}).catch((err) => {
        console.log(err.message);
        err = null;
    });
    if (res.length == 0) {
        return null;
    } else {
        var cardpath = path.concat('/').concat(res[0].set_code).concat('/').concat(res[0].collector_number.replace('*', '_star')).concat('.json')
        var item = JSON.parse(await fs.readFile(cardpath, "utf-8"))
        item.card_id = id;
        //console.log(item)
        return item;
    }
}

exports.fetchCardObjectDataInBulk = async (variable, opts = { type: 'string' }) => {
    var sets;
    if (opts.type == 'string') {
        sets = await this.queryCardList(variable)
    } else {
        sets = variable
    }
    var lst = []
    if (sets === undefined) {
        return lst;
    }
    sets.map((item) => {
        if (opts.type == 'string') {
            obj = this.fetchCardObjectData(item.set_code, item.collector_number)
        } else {
            obj = this.fetchCardObjectDataByID(item)
        }
        lst.push(obj)
    })
    return lst
}


exports.getPreviews = async (nameFragment, opts = { type: 'string' }) => {
    lst = await Promise.all(await this.fetchCardObjectDataInBulk(nameFragment, opts));
    list = lst.map((JSONCardObj) => {
        return ({
            name: JSONCardObj.name,
            collector_number: JSONCardObj.collector_number,
            set_id: JSONCardObj.collector_number,
            set: JSONCardObj.set,
            set_code: JSONCardObj.set,
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

exports.getDetailedList = async (nameFragment, opts = { type: 'string' }) => {
    lst = await Promise.all(await this.fetchCardObjectDataInBulk(nameFragment, opts));
    list = lst.map((JSONCardObj) => {
        JSONCardObj.set_id = JSONCardObj.collector_number;
        return JSONCardObj
    }
    )
    return list;
}

exports.getID = async (set_code, collector_number) => {
    res = await dbModule.getConnectionInstance().cards.select({set_code: set_code, collector_number: collector_number}).catch((err) => {
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