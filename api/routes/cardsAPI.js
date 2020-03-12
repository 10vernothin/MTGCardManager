var express = require('express');
var router = express.Router();
var cards = require('../database/cards');

//cards.fetchAllCards().then((res)=>{console.log(res)});



//cards.getPreviews('Tutor').then((res) => {
//    console.log(res);
//});


cards.getPrices('Tutor').then((res) => {
    console.log(res);
});

router.post('/api/cards/query-card', function(req, res, next) { 
    cardName = req.body.formControls.cardName.value
    if (cardName === '') {
        res.send([])
    } else {
        cards.getPreviews(req.body.formControls.cardName.value).then((list) => {console.log(list); res.json(list)})
    }
});


module.exports = router;