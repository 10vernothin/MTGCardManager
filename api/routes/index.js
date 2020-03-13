var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*fetch collection*/
router.get('/api/getCollection', function(req, res, next) {
  console.log("PING");
  res.json([]);
});


module.exports = router;
