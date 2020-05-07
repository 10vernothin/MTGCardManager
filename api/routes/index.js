var express = require('express');
var router = express.Router();
var _db = require('../database/database.js')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/getDBDetails', function (req, res, next) {
  let details = _db.getDetails()
  let newForm = {
    host: { value: details.host },
    port: { value: details.port },
    database: { value: details.database },
    user: { value: details.user },
    password: { value: details.password }
  }
  res.send(newForm);
});

module.exports = router;
