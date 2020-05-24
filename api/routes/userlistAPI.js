const express = require('express');
const router = express.Router();

//Connect to database
const dbModule = require('../database/database');
var pgdb = dbModule.getConnectionInstance();

/* GET users listing. */
router.get('/api/getList', function(req, res, next) {
    pgdb.users.list(['username']).then(
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