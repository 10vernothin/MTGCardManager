var express = require('express');
var router = express.Router();
var cards = require('../tools/cardFetcher');
var downloader = require('../tools/fileDownloader');
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
            let cachedImageBaseURL = "../api/json/scryfall/cards"
            let cardset = req.body.set;
            let cardset_id = req.body.set_id;
            let image_type = req.body.image_type.type;
            if (req.body.image_uris === undefined) {
                res.send({uri:'', cached: false})
            } else {
            let download_uri = req.body.image_uris[image_type];
            let setPath = cachedImageBaseURL.concat('/').concat(cardset).concat('/images/');
            let ext = download_uri.split('/').slice(-1)[0].split('.').slice(1)[0].substr(0,3)
            let filename = cardset_id.replace('*', '_star').concat('_').concat(image_type).concat(`.${ext}`)
            let imgPath = setPath.concat(filename)
            fsPromise.readFile(imgPath)
                .then(
                    (file) => {
                        console.log("FILE FOUND")
                        res.json({uri: imgPath, data: file, cached: true})
                    })
                .catch(
                    (err) => {
                        console.log("FILE NOT FOUND. ATTEMPTING TO DOWNLOAD")
                        if (err.code === 'ENOENT') {
                            fsPromise.mkdir(setPath, {recursive: true})
                            .catch((err)=>{
                                if(!(err.code === 'EEXIST')){
                                    console.log("PING")
                                    console.log(err.message)
                                }
                            })
                            .finally(() => {
                                downloader.downloadFile(download_uri, imgPath, (data) => {
                                    if (!(data === 0)) {
                                        console.log("FILE NOT DOWNLOADED.")
                                        res.json({uri: download_uri, cached: false})
                                    } else {
                                        console.log("FILE DOWNLOADED.")
                                        res.json({uri: imgPath, cached: true})
                                    }
                                })
                            });
                        } else {
                            console.log(err.message)
                            res.json({uri: download_uri, cached: false});
                        }
                    });
        }
    });



/*
fetch-list-of-SVG fetches 
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

router.post('/api/cards/fetch-card-attribute', function(req, res, next) {
    let attributes = req.body.opts.map((item) => {
        return item
    })
    cards.selectCardJSONDataInBulk(req.body.lstOfIds, {type: 'id'}).then((res) => {
        return Promise.all(res)
    }).then((ress) =>{
        let n = []
        ress.map((obj, index) => {
            let listObj = {}
            attributes.forEach((attr) =>{
                if (!(obj === null)){
                    listObj[attr] = JSON.parse(JSON.stringify(obj))[attr.toLowerCase()]
                }
            })
            listObj.id = req.body.lstOfIds[index]
            listObj.is_foil = req.body.is_foil[index]
            listObj.amt = req.body.amt[index]
            n.push(listObj)
        })
        res.json(n)
    }).catch((err) => {
        console.log(err);
    })
})

module.exports = router;