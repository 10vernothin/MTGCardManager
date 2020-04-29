var express = require('express');
var router = express.Router();
var cards = require('../tools/cardFetcher');
var downloader = require('../tools/fileDownloader');
var fsPromise = require('fs').promises;


/*
This api call receives a request(formControls(cardName.value)) and sends a list of card previews (card objects with limited 
attributes) that corresponds to the name
 */
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
Lazy image caching:
This API call receives a request(set, set_id, image_type={type:normal}, image_uris) and
downloads the image file to its proper set folder at json/scryfall/cards if it does not exist
Then sends the image file data, or if the download fails, sends the online URI
*/
router.post('/api/cards/retrieve-cached-image', function(req, res, next) { 
            let cachedImageBaseURL = "../api/json/scryfall/cards"
            let cardObj = req.body.cardObj;
            let cardset = cardObj.set;
            let cardset_id = cardObj.set_id;
            let image_type = req.body.image_type.type;
            if (cardObj.image_uris === undefined) {
                console.log("NO IMAGE IN THIS FORMAT FOR " + cardset + "."+ cardset_id)
                res.json({uri: '', data:'', imgType:'', cached: false})
            } else {
                let download_uri = cardObj.image_uris[image_type];
                let setPath = cachedImageBaseURL.concat('/').concat(cardset).concat('/images/');
                let ext = download_uri.split('/').slice(-1)[0].split('.').slice(1)[0].substr(0,3)
                let filename = cardset_id.replace('*', '_star').concat('_').concat(image_type).concat(`.${ext}`)
                let imgPath = setPath.concat(filename)
                fsPromise.readFile(imgPath)
                    .then(
                        (file) => {
                            res.json({uri: imgPath, data: file.toString('base64'), imgType: ext, cached: true})
                        })
                    .catch(
                        (err) => {
                            console.log("FILE NOT FOUND. ATTEMPTING TO DOWNLOAD")
                            if (err.code === 'ENOENT') {
                                fsPromise.mkdir(setPath, {recursive: true})
                                .catch((err)=>{
                                    if(!(err.code === 'EEXIST')){
                                        console.log(err.message)
                                    }
                                })
                                .finally(() => {
                                    downloader.downloadFile(download_uri, imgPath, (data) => {
                                        if (!(data === 0)) {
                                            console.log("FILE NOT DOWNLOADED.")
                                            res.json({uri: download_uri, data:'', imgType:'', cached: false})
                                        } else {
                                            console.log("FILE DOWNLOADED.")
                                            fsPromise.readFile(imgPath)
                                            .then(
                                                (file) => {
                                                    res.json({uri: imgPath, data: file.toString('base64'), imgType: ext, cached: true})
                                                }
                                            )
                                            .catch(() =>{
                                                console.log("ERROR: SOMETHING WENT WRONG")
                                                res.json({uri: download_uri, data:'', imgType:'', cached: false})
                                            })
                                        }
                                    })
                                });
                            } else {
                                console.log(err.message)
                                res.json({uri: download_uri, data:'', imgType:'', cached: false})
                            }
        })}
    });



/*
This api call receives a request(list(formatted_string)) and fetches the URIs of mana symbols according to the list
*/
router.post('/api/cards/fetch-list-of-SVG', function(req, res, next) {
    let SymFolderPath = "../api/json/scryfall/symbols/"
    let metafile = SymFolderPath.concat('sym_index.json')
    try{
        fsPromise.readFile(metafile, {encoding: 'utf-8'})
        .then((data) => {
            let ds = JSON.parse(data)
            listOfURLs = req.body.map((symbol) => { 
                if (symbol === '{//}') {
                    return (symbol)
                } else {
                    return(ds.filter((i) => i.symbol === symbol)[0].local_downloadPath)
                }
                
            })
           res.json({data:listOfURLs})
        })
        .catch((err)=>{console.log(err); res.json({data:[]})})
    } catch (err) {
        console.log(err)
        res.json({data:[]})
    }
});

/*
This api call receives a request(list_of_card_id, opts{attributes}) and sends a list of JSON cardObjs that has the 
contains the attributes of the corresponding card_id
*/
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