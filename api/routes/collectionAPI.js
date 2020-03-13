
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
            console.log(data);
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
    pgdb.any("SELECT * from collection where id = $1", [req.body.user_ID])
    .then((data) => {
        console.log(data);
        if (data.length == 0) {
            console.log('No cards in Collection.')
            res.send([])
        } else {
            //cards.createCollectionList(data)
        }
    })
});

router.post('/api/collections/add-to-collection', function(req, res, next) {
    cards.getID(req.body.set, req.body.set_id).then((id) =>{
    pgdb.any("INSERT INTO COLLECTION ()", [req.body])
        .then((data) => {
            console.log(data);
            if (data.length == 0) {
                console.log('No cards in Collection.')
                res.send([])
            } else {
                //cards.createCollectionList(data)
            }
        })
    })
});

  module.exports = router