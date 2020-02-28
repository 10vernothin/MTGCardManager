
var express = require('express');
var router = express.Router();
var _db = require('../database/database');
var pgdb = _db.getConnectionInstance();

/*check logged in session*/
router.get('/api/request-session', function(req,res,next) {
    console.log({Logged: _db.isLoggedIn(), User: _db.loggedUser()});
    res.send({Logged:_db.isLoggedIn(), LoggedUser: _db.loggedUser()});
});

/* login handling */
router.post('/api/login/submit-form', function(req, res, next) {
    //console.log(req.body.formControls.name.value);
    pgdb.any(
              "SELECT * from users where username = $1 AND pwd = $2", 
              [req.body.formControls.name.value, req.body.formControls.password.value]
            ).then(
      function(data) {
        console.log('Login query completed.' + data.length);
        if (data.length == 0) {
          console.log("Login Not found.")
          res.send("Username or Password incorrect.");
        } else {
          loggeduser = data[0].username;
          _db.login(loggeduser);
          res.send(data[0].username);
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
  name = req.body.formControls.name.value;
  pwd = req.body.formControls.password.value;
  email = req.body.formControls.email.value;
  response = ''
  validity = 0
  if (name.replace(/\s/g, '').length == 0) {
    response = response.concat("Please Enter a Name. ");
    validity = 1;
  }
  if (pwd.replace(/\s/g, '').length == 0) {
    response = response.concat("Please Enter a Password. ");
    validity = 1;
  }
  if (email.replace(/\s/g, '').length == 0) {
    response = response.concat("Please Enter an Email. ");
    validity = 1;
  }
  if (validity == 0) {
    pgdb.any( "INSERT INTO users (username, pwd, email) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING RETURNING username" ,[name,pwd,email])
    .then(function(data) {
        if (data.length == 0) {
          console.log("Account not made.")
          response = response.concat("Account Not Made. Either username or email has been taken. Please log in using your account details.");
          res.send(response);
        } else {
          console.log("Account made.")
          response = response.concat("New User created!");
          res.send(response);
        }
    })
    .catch( error => console.log("Error:" + error))
  } else {
    res.send(response);
  }
});

module.exports = router;