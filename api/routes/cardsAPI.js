var express = require('express');
var router = express.Router();
var cards = require('../database/cards');



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


module.exports = router;