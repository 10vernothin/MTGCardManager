var express = require('express');
var router = express.Router();
var cards = require('../database/cards');

//cards.fetchAllCards().then((res)=>{console.log(res)});

cards.queryCardList('TuTor').then((res) => {console.log(res)});

module.exports = router;