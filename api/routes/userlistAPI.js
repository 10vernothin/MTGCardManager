var express = require('express');
var router = express.Router();

//Connect to database
var _db = require('../database/database');
var pgdb = _db.getConnectionInstance();


/* GET users listing. */
router.get('/api/getList', function(req, res, next) {
    pgdb.any(
      "SELECT username from users"
    ).then(
          function(data) {  
            JSON.stringify(data);
            lst = []
            for (i = 0; i < data.length; i++) {
              lst.push(data[i].username);
            }
            console.log(lst);
            res.json(lst);
        }
  ).catch (
        error => {
        console.log('ERROR:', error);
        }
    )
  });

  module.exports = router;