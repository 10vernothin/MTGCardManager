
var express = require('express');
var router = express.Router();
var _db = require('../database/database');
var pgdb = _db.getConnectionInstance();
var encryptor = require('../tools/Encryptor')

/* login handling */
router.post('/api/login/submit-form', function(req, res, next) {
  encryptedPassword = encryptor.EncryptString256(req.body.formControls.password.value)
  console.log("Login Form Submitted");
  pgdb.users.select({username: req.body.formControls.name.value, pwd:encryptedPassword}).then(
    function(data) {
      console.log('Login query completed.');
      if (data.length == 0) {
        console.log("Login Not found.")
        res.status(400).json("Login Failed.");
      } else {
        res.json(data[0]);
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
  pwd = encryptor.EncryptString256(req.body.formControls.password.value);
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
    pgdb.users.add({username:name,email:email,pwd:pwd})
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