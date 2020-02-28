var express = require('express');
var router = express.Router();

//Connect to database
var pgp = require('pg-promise') (/*options*/);
var dbDets = require('../db-info.js');
const pgdb = pgp(dbDets);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

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

/* login handling */
router.post('/api/login/submit-form', function(req, res, next) {
    //console.log(req.body.formControls.name.value);
    pgdb.any(
              "SELECT * from users where username = $1 AND pwd = $2", 
              [req.body.formControls.name.value, req.body.formControls.password.value]
            ).then(
      function(data) {
        console.log('Login query completed.' + data);
        if (data.length == 0) {
          console.log("Login Not found.")
          res.send("Username or Password incorrect.");
        } else {
          res.send(data);
        }
      }
    ).catch (
      error => {
        console.log('ERROR:', error);
      }
    )
});

/* new user handling */
router.post('/api/create-new-user', function(req, res, next) {
  console.log("new user");
  res.send("New User!");
});


module.exports = router;
