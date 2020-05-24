
const express = require('express');
const router = express.Router();
const dbModule = require('../database/database');
const cards = require('../tools/cardFetcher');

/*
This api call receives a request:{form:{name,userID,desc}} and creates an entry in collection_list
that is associated with that user, with the given name and desc 
*/
router.post('/api/collections/create-collection', function (req, res, next) {
    try {
        console.log("Collection Creation Form Submitted");
        //console.log("UserID" + req.body.userID);
        var form = req.body.formControls
        if (form.name.value.replace(/^\s+$/, '').length === 0) {
            console.log("Collection Creation Error: Name is not defined");
            res.send('-1');
        } else if (req.body.userID === 0) {
            console.log("Collection Creation Error: UserID is not defined");
            res.send('-3');
        } else {
            dbModule.getConnectionInstance().listing.add({
                user_id: req.body.userID,
                collection_name: form.name.value,
                description: form.desc.value.replace(/^\s+/, '').replace(/\s+$/, ''),
                showcase_card_id: form.preview.value
            }).then(
                function (data) {
                    console.log('Creation query completed.' + data.length);
                    if (data.length == 0) {
                        console.log("Error: Collection Not Made.")
                        res.send('-2');
                    } else {
                        //console.log(data)
                        res.json(data[0]);
                    }
                }
            ).catch(
                error => {
                    console.log('Collection Creation ERROR:', error);
                }
            )
        }
    } catch (err) {
        console.log(err)
        res.status(400).send(err)
    }
}
);

/*
This api receives a request(collectionID) deletes the collection
*/
router.post('/api/collections/delete-collection', function (req, res, next) {
    try {
        dbModule.getConnectionInstance().listing.remove(req.body.collectionID)
            .then(() => {
                console.log('Collection Deleted.')
                res.send([])
            }).catch((err) => {
                console.log(err.message);
            })
    } catch (err) {
        console.log(err)
        res.status(400).send(err)
    }
});

/*
This api receives a request({collectionID, formControls{name.value, desc.value, prev.value}}) and edit the collection
*/
router.post('/api/collections/edit-collection', function (req, res, next) {
    try {
        var form = req.body.formControls;
        if (form.name.value.replace(/^\s+$/, '').length === 0) {
            console.log("Edit Collection Error: Name is not defined");
            res.send('-1');
        } else if (req.body.collectionID === 0) {
            console.log("Edit Collection Error: CollectionID is not defined");
            res.send('-3');
        } else {
            dbModule.getConnectionInstance().listing.update(
                req.body.collectionID,
                { collection_name: form.name.value, description: form.desc.value, showcase_card_id: form.preview.value !== ""?form.preview.value:null })
                .then(() => {
                    console.log('Collection Editted.')
                    res.send('0')
                })
                .catch((err) => {
                    console.log(err);
                    res.send('-2')
                })
        }
    } catch (err) {
        console.log(err)
        res.status(400).send(err)
    }
});


/*
This api call receives a request:{userID} to fetches all rows in collection_list associated with that user
*/
router.post('/api/collections/get-list-of-collections-by-id', function (req, res, next) {
    try {
        console.log("Getting Collection List for userID: " + req.body.userID);
        dbModule.getConnectionInstance().listing.fetchList(req.body.userID)
            .then((data) => {
                console.log('Collection list query completed.' + data.length);
                if (data.length == 0) {
                    console.log("No collection found.")
                    res.send([]);
                } else {
                    //console.log(data);
                    res.json(data);
                }
            }
            ).catch(
                error => {
                    console.log('Collection Creation ERROR:', error);
                    res.send(err)
                }
            )
    } catch (err) {
        console.log(err)
        res.status(400).send(err)
    }
});

/*
This api receives a request(collectionID) to fetch all rows in TABLE collection associated with the unique collection_list_id
joined with the associated columns in TABLE cards where cards.id = collection.card_id
*/
router.post('/api/collections/fetch-collection-by-id', function (req, res, next) {
    try {
        var collectionID = req.body.collectionID
        dbModule.getConnectionInstance().listing.select(collectionID)
            .then((listingData) => {
                if (listingData.length === 0) {
                    console.log('Something went wrong. No collection by that ID.')
                    res.status(407).send([])
                } else {
                    dbModule.getConnectionInstance().collection.fetchCollection(collectionID).then((result) =>{
                        var response = []
                        if (result.length === 0) {
                            console.log('No cards in Collection.')
                        } else {
                            console.log(result)
                            response = result
                        }
                        res.send({name: listingData[0].collection_name, description: listingData[0].description, list: result})
                    })
                }
            }).catch((err) => {
                console.log(err);
                res.status(400).send([])
            })
    } catch (err) {
        console.log(err)
        res.status(400).send(err)
    }
});

/*
This api call receives a request:{card_id} to fetch cardObject data by its unique card_id, and send the cardObject to the client
*/
router.post('/api/collections/fetch-card-object', function (req, res, next) {
    
    if (req.body.card_id == 0) {
        console.log('Card has a null ID (0).')
        res.send([])
    } else {
        cards.getDetailedList([req.body.card_id], { type: 'id' })
            .then((data) => {
                
                if (data.length == 0) {
                    console.log('No such card with this ID: ' + req.body.card_id)
                    res.send([])
                } else {
                    console.log('Successful Fetch: ' + req.body.card_id)
                    res.send(data);
                }
            }).catch((err) => {
                console.log(err.message);
            })
    }
});

/*
This helper function fetches cardObject details using a list of card_ids with set_id=collector_number 
(Warning: if lstIDs.length is too large you will receive an error 
    It is recommended to do Z queries with X arrays of Y(<20) items)
*/
createCollectionList = async (lstIDs, opts = { type: 'list' }) => {
    lst = await Promise.all(await cards.getDetailedList(lstIDs, opts));
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
router.post('/api/collections/add-card-to-collection', function (req, res, next) {
    cards.getID(req.body.set, req.body.set_id).then((id_) => {
        dbModule.getConnectionInstance().collection
            .add({ card_id: id_.id, listing_id: req.body.collectionID, is_foil: req.body.chosenIsFoil })
            .then(() => {
                res.send([])
            }).catch((err) => { console.log(err) })
    }).catch((err) => { console.log(err.message) })
});

/*
This api call receives a delete request for a card defined by {$set, $set_id, $chosenIsFoil}
from {$collection_id} and removes 1 from the matching amt column or deletes the entry if amt=1
*/
router.post('/api/collections/remove-card-from-collection', function (req, res, next) {
    cards.getID(req.body.set, req.body.set_id).then((id_) => {
        console.log("Card ID: " + id_.id + " Foil: " + req.body.chosenIsFoil)
        dbModule.getConnectionInstance().collection
            .remove({ card_id: id_.id, listing_id: req.body.collectionID, is_foil: req.body.chosenIsFoil })
            .then(res.send([]))
            .catch((err) => { "DEL Err: ", console.log(err) })
    }).catch((err) => { "getID err: ", console.log(err.message) })
});

/*
These two functions reformats the collection either as a JSON file or a CSV file and sends it to the client 
*/
router.post('/api/collections/fetch-collection-as-JSON', function (req, res, next) {
    dbModule.getConnectionInstance().collection.download(req.body.id)
        .then((data) => {
            if (data.length == 0) {
                console.log('No cards in Collection.')
                res.send([])
            } else {
                let json = {}
                json.name = data[0].collection_name
                json.type = "list"
                json.id = data[0].listing_id
                json.description = data[0].description
                let dataset = []
                data.forEach((item) => {
                    ds = {};
                    ds.card_name = item.card_name
                    ds.set_code = item.set_code
                    ds.collector_number = item.collector_number
                    ds.amt = item.amt
                    ds.is_foil = item.is_foil
                    dataset.push(ds)
                })
                json.data = dataset
                res.json(json)
            }
        }).catch((err) => {
            console.log(err.message);
        })
})

router.post('/api/collections/fetch-collection-as-CSV', function (req, res, next) {
    dbModule.getConnectionInstance().collection.download(req.body.id)
        .then((data) => {
            if (data.length == 0) {
                console.log('No cards in Collection.')
                res.send([])
            } else {
                ds = `"Collection Name","Collection ID","Description","Card Name", "Card Set", "Collector's Number", "Amount", "Foil"\n`
                data.forEach((item) => {
                    ds = ds.concat(`"${item.collection_name}","${item.listing_id}","${item.description}","${item.card_name}",`)
                    ds = ds.concat(`"${item.set_code}","${item.collector_number}","${item.amt}","${item.is_foil}"\n`)
                })
                ds.substr(0, ds.length - 1)
                res.send(ds)
            }
        }).catch((err) => {
            console.log(err.message);
        })
})

module.exports = router
