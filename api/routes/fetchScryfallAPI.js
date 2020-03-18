
var express = require('express');
var router = express.Router();
var fs = require('fs');
var dpd = require('../tools/ScryfallDataDownloader')

/*This part will require a connection to the internet*/
uri = 'https://api.scryfall.com/cards'
path = "../api/json/scryfall/cards"
datePath = '../api/json/scryfall/last_updated_date.date';

/*This accesses the scryfall API and downloads the data into the server cache at './api/json/scryfall'*/
router.get('/api/fetch-card/download-bulk-data', function(req, res, next) {
        dateobj = new Date();
        year_month = (dateobj.getFullYear().toString()).concat('_').concat((dateobj.getMonth() + 1).toString().padStart(2,'0'));
        day = dateobj.getDate().toString().padStart(2,'0');
        datestring = ''.concat(year_month).concat('_').concat(day);
        //writing date tag file
        fs.mkdir(path, (err) => {
            //console.log(err);
            err = null;
        });
        fs.writeFile(datePath, datestring, (err) => {
            if (err) {
                console.log(err.message); err = null;}
        });
        dpd.downloadPricingData(uri, path);
        res.send("Request Sent");
});

/*Checks if Scryfall data is outdated */
router.get('/api/fetch-card/check-updateable', function(req, res, next) {
    dateobj = new Date();
    year_month = (dateobj.getFullYear().toString()).concat('_').concat((dateobj.getMonth() + 1).toString().padStart(2,'0'));
    day = dateobj.getDate().toString().padStart(2,'0');
    datestring = ''.concat(year_month).concat('_').concat(day);
    fs.readFile(datePath, (err, data) => {
        if (err || !(data == datestring)) {
            console.log("Scryfall needs an update.");
            res.send('-1');
        } else {
            console.log("Scryfall doesn't need update.")
            res.send('0');
        };
    })
});


module.exports = router;