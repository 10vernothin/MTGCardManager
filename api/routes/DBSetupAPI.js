var express = require('express');
var router = express.Router();
var _db = require('../database/database.js')

router.get('/api/DBSetup/get-DB-details', function (req, res, next) {
  let details = _db.getDetails()
  let newForm = {
    host: { value: details.host },
    port: { value: details.port },
    database: { value: details.database },
    user: { value: details.user },
    password: { value: details.password }
  }
  _db.testConnection(details)
  .then((data)=>{
    newForm.status = {value: data};
    res.send(newForm)})
  ;
});

router.post('/api/DBSetup/test-connection', function (req, res, next) {
  let newDetObj = {
    host: req.body.formControls.host.value ,
    port: req.body.formControls.port.value,
    database: req.body.formControls.database.value ,
    user: req.body.formControls.user.value,
    password: req.body.formControls.password.value
  }
  _db.testConnection(newDetObj)
  .then((data)=>{res.send(data)})
  .catch((err) => {res.status(400);console.log(err)});
  
})

router.post('/api/DBSetup/update-db-info', function (req, res, next) {
  let newDetObj = {
    host: req.body.formControls.host.value ,
    port: req.body.formControls.port.value,
    database: req.body.formControls.database.value ,
    user: req.body.formControls.user.value,
    password: req.body.formControls.password.value
  }
  _db.testConnection(newDetObj)
  .then((data)=>{
    if (data) {
      _db.updateDatabaseDetails(newDetObj).then((err) => {res.send(true)})
    }})
  .catch((err) => {res.status(400);console.log(err)});
  
})

module.exports = router;
