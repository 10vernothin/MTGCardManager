var https = require('https');
var fs = require('fs');
var _db = require('../database/database');
var pgdb = _db.getConnectionInstance();
var downloader = require('./FileDownloader')
var imageDownloader = require('../tools/ImageDataDownloader')
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

exports.downloadScryfallData = (uri, downloadPath) => {
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
                            let setdownloadPath = downloadPath.concat('/').concat(item.set);
                            fs.mkdir(setdownloadPath, (err) => {
                                    //console.log(err);
                                    err = null;
                            });
                            let carddownloadPath = setdownloadPath.concat('/').concat(item.collector_number.replace('*','_star')).concat('.json');
                            let stringJSON = JSON.stringify(item).valueOf();

                            //writing data to json
                            fs.writeFile(carddownloadPath, stringJSON, (err) => {
                                    err = null;
                            });
                            
                            //inserting relevant data to database
                            pgdb.none("INSERT into cards(name, set, set_id, price, foil_price) values($1, $2, $3, $4, $5) ON CONFLICT ON CONSTRAINT cards_set_key DO UPDATE SET name = EXCLUDED.name, set = EXCLUDED.set, set_id = EXCLUDED.set_id, price = EXCLUDED.price, foil_price = EXCLUDED.foil_price",
                            [item.name, item.set , item.collector_number, (item.prices.usd === null? 0:item.prices.usd),  (item.prices.usd_foil === null? 0:item.prices.usd_foil)])
                            .catch((err) => {
                                console.log(err.message);
                                err = null;
                            })

                            //setting nulls
                            setdownloadPath = null;
                            carddownloadPath = null;
                            stringJSON = null;
                        }
                    });
                if (ds.has_more) {
                    console.log(`${uri} logged. Logging next page...`);
                    let next_p = ds.next_page.valueOf();
                    setTimeout(() => { this.downloadScryfallData(next_p, downloadPath);
                        next_p = null;
                    }, 50);
                    ds = null;
                    dataset = null;
                    resp = null;
                    uri = null;
                    return;
                } else {
                    imageDownloader.downloadAllCards()
                    return;
                }
            });
        })
        .on("error", (err) => {console.log("Error: " + err); err = null});
        return;
};

exports.downloadSymbology = (uri, downloadPath, opts={includeMeta: true, metaDirdownloadPath:downloadPath}) => {
    uri = uri.valueOf()
    https.get(uri, (resp) => {
        let data = ''
        resp.on('data', (chunk) => {
            data += chunk;
            chunk=null;
            resp=null;
        })
        resp.on('end', () => {
                let ds = JSON.parse(data).data
                ds.forEach((item, index)=>{
                        let filename = `symbol_id_${index}`
                        let imgdownloadPath = downloadPath.concat(filename).concat('.svg')
                        item.local_downloadPath = imgdownloadPath; 
                        downloader.downloadFile(item.svg_uri, imgdownloadPath, (err) => {if(!(err === 0)){console.log(err)}})
                })
                if (opts.includeMeta) {
                    let metaFiledownloadPath = opts.metaDirdownloadPath.concat('sym_index').concat('.json')
                    fs.writeFile(metaFiledownloadPath, JSON.stringify(ds), (err) => {
                        err = null;
                    });
                }
        })

    })

}

exports.downloadAllImages = (uri, downloadPath) => {
        uri = uri.valueOf();      
        return;
};


