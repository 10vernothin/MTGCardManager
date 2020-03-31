var express = require('express');
var router = express.Router();
var cards = require('../tools/card-fetcher');
var downloader = require('../tools/file-downloader');
var fsPromise = require('fs').promises;


router.post('/api/cards/query-card', function(req, res, next) { 
    cardName = req.body.formControls.cardName.value
    if (cardName === '') {
        res.send([])
    } else {
        cards.getPreviews(req.body.formControls.cardName.value).then((list) => {
            //console.log(list[0])
            console.log(list.length+" Results Queried.");
            res.send(list)})
    }
});

/*
Lazy image caching,
This API call receives a request(set, set_id, image_type={type:normal}, image_uris) and
downloads the .png file to its proper set folder at json/scryfall/cards if it does not exist
Then sends the img URL, or if the download fails sends the URI
*/
router.post('/api/cards/retrieve-cached-image', function(req, res, next) { 
        try{
            let cachedImageBaseURL = "../api/json/scryfall/cards"
            let cardset = req.body.set;
            let cardset_id = req.body.set_id;
            let image_type = req.body.image_type.type;
            if (req.body.image_uris === undefined) {
                res.send({uri:''})
            } else {
            let download_uri = req.body.image_uris[image_type];
            let setPath = cachedImageBaseURL.concat('/').concat(cardset).concat('/images/');
            let filename = cardset_id.replace('*', '_star').concat('_').concat(image_type).concat('.png')
            let imgPath = setPath.concat(filename)
            fsPromise.readFile(imgPath)
                .then(
                    () => {
                        res.json({uri: imgPath})
                    },
                    (err) => {
                        if (err.code === 'ENOENT') {
                            fsPromise.mkdir(setPath).catch((err)=>{if(!(err.code === 'ENOENT')){console.log(err.message)}}).finally(() => {
                                downloader.downloadFile(download_uri,imgPath, (downloader_resp) => {
                                    if (downloader_resp === 0) {
                                        console.log(imgPath, " created.")
                                        res.json({uri: imgPath});
                                    } else {
                                        console.log(imgPath, " not created.")
                                        res.json({uri: download_uri});
                                }
                            })
                        });
                    } else {
                        console.log(err.message)
                    }
                });
        }} catch (err) {
            console.log(err.message)
            res.json({uri: download_uri});
        }
    });



/*
Lazy image caching,
This API call receives a request(set, set_id, image_type={type:normal}, image_uris) and
downloads the .png file to its proper set folder at json/scryfall/cards if it does not exist
Then sends the img URL, or if the download fails sends the URI
*/

router.post('/api/cards/fetch-list-of-SVG', function(req, res, next) {
    let SymFolderPath = "../api/json/scryfall/symbols/"
    let metafile = SymFolderPath.concat('sym_index.json')
    try{
        fsPromise.readFile(metafile, {encoding: 'utf-8'})
        .then((data) => {
            let ds = JSON.parse(data)
            listOfURLs = req.body.map((symbol) => { 
                return(ds.filter((item) => item.symbol === symbol)[0].local_path)   
            })
           res.json({data:listOfURLs})
        })
        .catch((err)=>{console.log(err); res.json({data:[]})})
    } catch (err) {
        console.log(err)
        res.json({data:[]})
    }
});


module.exports = router;