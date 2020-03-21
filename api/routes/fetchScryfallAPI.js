
var express = require('express');
var router = express.Router();
var fs = require('fs');
var dpd = require('../tools/Scryfall-data-downloader')

/*This part will require a connection to the internet*/

/*Defining Paths */
uri = 'https://api.scryfall.com/cards'
path = "../api/json/scryfall/cards"
datePath = '../api/json/scryfall/last_updated_date.date';
symuri = 'https://api.scryfall.com/symbology'
sympath = '../api/json/scryfall/symbols/'
clientsympath = '../client/src/common/images/image_src/'

/*This accesses the scryfall API and downloads the data into the server cache at './api/json/scryfall'*/
router.get('/api/fetch-card/download-bulk-data', function(req, res, next) {
        dateobj = new Date();
        year_month = (dateobj.getFullYear().toString()).concat('_').concat((dateobj.getMonth() + 1).toString().padStart(2,'0'));
        day = dateobj.getDate().toString().padStart(2,'0');
        datestring = ''.concat(year_month).concat('_').concat(day);
        //creating folder and writing date tag file
        fs.mkdir(path, (err) => {
            //console.log(err);
            err = null;
        });
        fs.writeFile(datePath, datestring, (err) => {
            if (err) {
                console.log(err.message); err = null;}
        });
        dpd.downloadScryfallData(uri, path);
        
        //creating the symbology folder 
        fs.mkdir(sympath, (err) => {
            //console.log(err);
            err = null;
        });
        dpd.downloadSymbology(symuri, clientsympath, {includeMeta: true, metaDirPath:sympath});
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