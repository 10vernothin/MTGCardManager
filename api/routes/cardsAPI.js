var express = require('express');
var router = express.Router();
var cards = require('../database/cards')
var keysList = cards.queryKeys();
var https = require('https');
var fs = require('fs');

keysList.map((item) => {
    console.log(item);
})

 
cards.queryCardList('tutor').map(
    (item) => {console.log(item.name, item.set, item.collector_number, item.tcgplayer_id);}
)

uri = 'https://api.scryfall.com/cards'
path = "../api/json/scryfall/cards/"
page_count = 100;

downloadPricingData = (uri, path, enduri = null) => {
        https.get(uri, (resp) =>
        {
            let dataset = '';
            //dump the chunk in
            resp.on('data', (chunk) => {
                dataset += chunk;
            });
            resp.on('end', () => {
                ls = []
                let ds = JSON.parse(dataset);
                ds.data.forEach((item) => {
                        let setPath = path.concat(item.set);
                        fs.mkdir(setPath, (err) => {
                            //console.log(err);
                        });
                        let cardPath = setPath.concat('/').concat(item.collector_number.replace('*','_star')).concat('.json');
                        let stream = fs.createWriteStream(cardPath, {flags:'w', autoClose: false});
                        stream.write(JSON.stringify(item));
                        ls.push(stream);
                    });
                ls.forEach((stream) => stream.end());
                /*
                if (ds.has_more && !(enduri === ds.next_page)) {
                    console.log(`${uri} logged. Logging next page...`);
                    downloadPricingData(ds.next_page,path);
                } else {
                    return;
                }
                */
            });
        })
        .on("error", (err) => {console.log("Error: " + err.message);});
};

downloadPricingDataPaged = (uri, path, page_freq, max_pages) => {
    i = 1;
    while (i < max_pages +1) {
        i++;
    }

}

module.exports = router;