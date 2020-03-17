
var express = require('express');
var router = express.Router();
var _db = require('../database/database');
var pgdb = _db.getConnectionInstance();
var cards = require('../database/cards');

/*
This api call receives a request:{form:{name,userID,desc}} and creates an entry in collection_list
that is associated with that user, with the given name and desc 
*/
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

/*
This api receives a request(collectionID) deletes the collection
*/
router.post('/api/collections/delete-collection', function(req, res, next) {
    pgdb.any("DELETE from collection_list where id = $1", [req.body.collectionID])
    .then((data) => {
        if (data.length == 0) {
            console.log('Collection Deleted.')
            res.send([])}
        }).catch((err) => {
        console.log(err.message);
    })
});


/*
This api call receives a request:{userID} to fetches all rows in collection_list associated with that user
*/
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

/*
This api receives a request(collectionID) to fetch all rows in TABLE collection associated with the unique collection_list_id
joined with the associated columns in TABLE cards where cards.id = collection.card_id
*/
router.post('/api/collections/fetch-collection-id', function(req, res, next) {
    pgdb.any("SELECT collection.id, cards.set_id, cards.set, collection.card_id, cards.name, collection_list.description, collection_list.id, collection.amt, collection.is_foil from collection inner join cards on collection.card_id = cards.id inner join collection_list on collection_list.id = collection.collection_list_id where collection_list_id = $1", [req.body.collectionID])
    .then((data) => {
        if (data.length == 0) {
            console.log('No cards in Collection.')
            res.send([])
        } else {
            res.send(data);
        }
    }).catch((err) => {
        console.log(err.message);
    })
});

/*
This api call receives a request:{card_id} to fetch cardObject data by its unique card_id, and send the cardObject to the client
*/
router.post('/api/collections/fetch-row', function(req, res, next) {
    cards.getDetails([req.body.card_id], {type: 'list'})
    .then((data) => {
        if (data.length == 0) {
            console.log('No cards in Collection.')
            res.send([])
        } else {
            res.send(data);
        }
    }).catch((err) => {
        console.log(err.message);
    })
});

/*
This helper function fetches cardObject details using a list of card_ids with set_id=collector_number 
(Warning: if lstIDs.length is too large you will receive a . 
    It is recommended to do Z=XY query with X arrays of Y(<20) items)
*/
createCollectionList = async (lstIDs, opts = {type: 'list'}) => {
    lst = await Promise.all(await cards.getDetails(lstIDs, opts));
    if (lst.length === 0) {
        return []
    } else {
        return lst;
    }
}

/*
This api call receives a add request for a card defined by {$set, $set_id, $chosenIsFoil}
from {$collection_id} and creates the entry with amt=1, or add 1 from the matching amt column if the card exists
*/
router.post('/api/collections/add-card-to-collection', function(req, res, next) {
    cards.getID(req.body.set, req.body.set_id).then((id_) =>{
    pgdb.any("INSERT INTO COLLECTION (card_id, collection_list_id, is_foil, amt) VALUES ($1, $2, $3, 1) ON CONFLICT ON CONSTRAINT unique_id_key DO UPDATE SET amt = COLLECTION.amt+1 WHERE collection.card_id = EXCLUDED.card_id and collection.collection_list_id = EXCLUDED.collection_list_id and collection.is_foil = EXCLUDED.is_foil",
     [id_.id, req.body.collectionID, req.body.chosenIsFoil])
        .then(() => {
            res.send([])
        }).catch((err) => {console.log(err)})
    }).catch((err) => {console.log(err.message)})
});

/*
This api call receives a delete request for a card defined by {$set, $set_id, $chosenIsFoil}
from {$collection_id} and removes 1 from the matching amt column or deletes the entry if amt=1
*/
router.post('/api/collections/remove-card-from-collection', function(req, res, next) {
    cards.getID(req.body.set, req.body.set_id).then((id_) =>{
        console.log("Card ID: " + id_.id +" Foil: " + req.body.chosenIsFoil)
        pgdb.any("DELETE from collection where amt = 1 and collection.card_id = $1 and collection.collection_list_id = $2 and collection.is_foil = $3",
                    [id_.id, req.body.collectionID, req.body.chosenIsFoil])
        .then(() => {
            pgdb.any("UPDATE collection SET amt = collection.amt - 1 WHERE collection.card_id = $1 and collection.collection_list_id = $2 and collection.is_foil = $3",
                        [id_.id, req.body.collectionID, req.body.chosenIsFoil])
            .then(res.send([]))
            .catch((err) => {console.log("UPD Err: ", err.message)})
        }).catch((err) => {"DEL Err: ", console.log(err)})
    }).catch((err) => {"getID err: ", console.log(err.message)})
});

  module.exports = router
