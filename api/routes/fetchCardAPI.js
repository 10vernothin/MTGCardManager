
var express = require('express');
var router = express.Router();
var fs = require('fs');
var https = require('https');
/* This part may not be needed
var _db = require('../database/database');
var pgdb = _db.getConnectionInstance();
*/


/*This accesses the scryfall API and downloads the data into the server cache at './api/json/scryfall'*/
try {
    router.get('/api/fetch-card/download-bulk-data', function(req, res, next) {
        dateobj = new Date();
        year_month = (dateobj.getFullYear().toString()).concat('_').concat((dateobj.getMonth() + 1).toString().padStart(2,'0'));
        day = dateobj.getDate().toString().padStart(2,'0');
        datestring = ''.concat(year_month).concat('_').concat(day);
        dirpath = '../api/json/scryfall/';
        datePath = dirpath.concat('last_updated_date.date');
        //writing date tag file
        fs.writeFile(datePath, datestring, (err) => {
            if (err) {
                console.log(err.message);
            }
        });
        //fetching bulk_list
        https.get('https://api.scryfall.com/bulk-data', (resp) =>{
            let dataset = '';
            resp.on('data', (chunk) => {
                dataset += chunk;
            });
            // The whole response has been received. Start loading.
            resp.on('end', () => {
                fullSet = JSON.parse(dataset).data;
                bulkListPath = dirpath.concat('bulk_metadata_listing.json');
                fs.writeFile(bulkListPath,JSON.stringify(fullSet), (err) => {
                    if (err) {
                        console.log("WriteError:", err);
                    }
                });       
                //Setting URI from the bulk listing and download path
                OracleCardsURIPath = '';
                RulingsURIPath = '';
                fullSet.map((items) => {
                    if (items.name === "Oracle Cards") {
                        OracleCardsURIPath = items.permalink_uri;
                    } else if (items.name === "Rulings") {
                        RulingsURIPath = items.permalink_uri;
                    }});
                cardsDumpPath = dirpath.concat('cards.json');
                rulingsDumpPath = dirpath.concat('rulings.json');
               
                //downloading data to the folder
                downloadData(OracleCardsURIPath, cardsDumpPath)
                downloadData(RulingsURIPath, rulingsDumpPath)
            });  
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
        res.send("Request Sent");
    });
} catch (err) {
    console.log("Wrapper Error:" ,err);
}

/*Helper function: downloads data from https URI and sending it to the server cache*/
downloadData = (uri, path) => {
    https.get(uri, (resp) =>
    {
        let dataset = '';
        //dump the chunk in
        resp.on('data', (chunk) => {
            dataset += chunk;
        });
        resp.on('end', () => {
            fs.writeFile(path, dataset, () =>{ console.log(path + ": Finished downloading.");});
        }).on("error", (err) => {console.log("Error: " + err.message);})
    });
};

/*Checks if Scryfall data is outdated */
router.get('/api/fetch-card/check-updateable', function(req, res, next) {
    dateobj = new Date();
    year_month = (dateobj.getFullYear().toString()).concat('_').concat((dateobj.getMonth() + 1).toString().padStart(2,'0'));
    day = dateobj.getDate().toString().padStart(2,'0');
    datestring = ''.concat(year_month).concat('_').concat(day);
    dirpath = '../api/json/scryfall/';
    datePath = dirpath.concat('last_updated_date.date');
    fs.readFile(datePath, (err, data) => {
        if (err || !(data == datestring)) {
            console.log("Scryfall needs an update.");
            res.send('-1');
        } else {
            console.log("Scryfall doesn't need update.")
            res.send('0');
        };
    })}
);
/*This part will require a connection to the internet*/


module.exports = router;