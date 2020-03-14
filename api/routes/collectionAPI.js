
var express = require('express');
var router = express.Router();
var _db = require('../database/database');
var pgdb = _db.getConnectionInstance();
var cards = require('../database/cards');

router.post('/api/collections/submit-creation-form', function(req, res, next) {
    console.log("Collection Creation Form Submitted");
    //console.log("UserID" + req.body.userID);
    if (req.body.formControls.name.value.replace(/^\s+$/, '').length === 0) {
        console.log("Collection Creation Error: Name is not defined");
        res.send('-1'); 
    } else if (req.body.userID === 0) {
        console.log("Collection Creation Error: UserID is not defined");
        res.send('-3'); 
    } else {
        pgdb.any(
                "INSERT INTO collection_list (player_id, name, description) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING RETURNING name", 
                [req.body.userID,req.body.formControls.name.value, req.body.formControls.desc.value.replace(/^\s+/, '').replace(/\s+$/, '')]
                ).then(
        function(data) {
            console.log('Creation query completed.' + data.length);
            if (data.length == 0) {
                console.log("Error: Collection Not Made.")
                res.send('-2');
            } else {
                //console.log(data)
                res.json(data[0]);
            }
        }
        ).catch (
        error => {
            console.log('Collection Creation ERROR:', error);
        }
        )
    }}
);

router.post('/api/collections/getList', function(req, res, next) {
    console.log("Getting Collection List for userID: " + req.body.userID);
    pgdb.any(
            "SELECT id, name, description from collection_list where player_id = $1", 
            [req.body.userID]
            ).then(
    function(data) {
        console.log('Collection list query completed.' + data.length);
        if (data.length == 0) {
            console.log("No collection found.")
            res.send([]);
        } else {
            //console.log(data);
            res.json(data);
        }
    }
    ).catch (
    error => {
        console.log('Collection Creation ERROR:', error);
    }
    )
});

router.post('/api/collections/fetch-collection', function(req, res, next) {
    pgdb.any("SELECT * from collection where collection_list_id = $1", [req.body.collectionID])
    .then((data) => {
        if (data.length == 0) {
            console.log('No cards in Collection.')
            res.send([])
        } else {
            ///.///console.log(data);
            lstIDs = data.map((ids) => {return ids.card_id})
            this.createCollectionList(lstIDs, {type: 'list'}).then(
                (list)=> {
                    //console.log(list);
                    data.forEach((item) => {
                        item.card_data = list.filter((list_i) => list_i.card_id == item.card_id)[0]
                    })
                res.send(data);
            })
            
        }
    }).catch((err) => {
        console.log(err.message);
    })
});

createCollectionList = async (lstIDs, opts = {type: 'list'}) => {
    lst = await Promise.all(await cards.getDetailedPreviews(lstIDs, opts));
    if (lst.length === 0) {
        return []
    } else {
        return lst;
    }
}

router.post('/api/collections/add-card-to-collection', function(req, res, next) {
    cards.getID(req.body.set, req.body.set_id).then((id_) =>{
        console.log("Card:" + req.body.set_id + req.body.set +" Foil:" + req.body.chosenIsFoil)
    pgdb.any("INSERT INTO COLLECTION (card_id, collection_list_id, is_foil, amt) VALUES ($1, $2, $3, 1) ON CONFLICT ON CONSTRAINT unique_id_key DO UPDATE SET amt = COLLECTION.amt+1 WHERE collection.card_id = EXCLUDED.card_id and collection.collection_list_id = EXCLUDED.collection_list_id and collection.is_foil = EXCLUDED.is_foil",
     [id_.id, req.body.collectionID, req.body.chosenIsFoil])
        .then((data) => {
            res.send([])
        }).catch((err) => {console.log(err)})
    }).catch((err) => {console.log(err.message)})
});

  module.exports = router
