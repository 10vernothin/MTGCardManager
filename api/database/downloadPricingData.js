var https = require('https');
var fs = require('fs');
var _db = require('./database');
var pgdb = _db.getConnectionInstance();

/*
This function fetches the paginated card data from Scryfall and populates each JSON card data object
into a file sorted into folders by the set where it was released. The name of the file will be its collector
number in the set. In addition, set_code, collector_number, and name has been upserted into the cards table for easy querying/

json/cards
-->set_code
------->collector_number.json 

table cards {
    set_id, set, name, id
}

Note: This is a recursive callback function that calls the function ~1500 times. In order to maximize efficiency, 
all assigned variables have been set to null after they are done being used, 
and all values are accessed byValue() if possible, then the variable is set to null.

100% efficient: 0.05s/page. This is if the function recurs immediately with no extra functionalities
Real runtime: ~0.98s/page so about 5% efficient.
*/

exports.downloadPricingData = (uri, path) => {
        uri = uri.valueOf();
        https.get(uri, (resp) =>
        {
            let dataset = '';
            //dump the chunk in
            resp.on('data', (chunk) => {
                dataset += chunk;
                resp = null;
                chunk = null;
            });
            resp.on('end', () => {
                let ds = JSON.parse(dataset);
                ds.data.forEach((item) => {
                        if (item.lang == "en") {
                            let setPath = path.concat('/').concat(item.set);
                            fs.mkdir(setPath, (err) => {
                                    //console.log(err);
                                    err = null;
                            });
                            let cardPath = setPath.concat('/').concat(item.collector_number.replace('*','_star')).concat('.json');
                            let stringJSON = JSON.stringify(item).valueOf();
                            fs.writeFile(cardPath, stringJSON, (err) => {//
                                    err = null;
                            });
                            
                            pgdb.none("INSERT into cards(name, set, set_id) values($1, $2, $3) ON CONFLICT ON CONSTRAINT cards_set_key DO UPDATE SET name = EXCLUDED.name, set = EXCLUDED.set, set_id = EXCLUDED.set_id",
                            [item.name, item.set , item.collector_number])
                            .catch((err) => {
                                console.log(err.message);
                                err = null;
                            })
                            setPath = null;
                            cardPath = null;
                            stringJSON = null;
                        }
                    });
                if (ds.has_more) {
                    console.log(`${uri} logged. Logging next page...`);
                    let next_p = ds.next_page.valueOf();
                    setTimeout(() => { this.downloadPricingData(next_p, path);
                        next_p = null;
                        ds = null;
                        dataset = null;
                        resp = null;
                        uri = null;
                    }, 50);
                    return;
                } else {
                    return;
                }
            });
        })
        .on("error", (err) => {console.log("Error: " + err); err = null});
        return;
};
