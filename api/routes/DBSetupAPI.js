var express = require('express');
var router = express.Router();
var _db = require('../database/database')
var dbDiagnostics = require('../database/diagnostics')

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
    .then((data) => {
      if (data) {
        testCurrentDBIntegrity().then((result) => {
          if (result.passed) {
            newForm.status = {value: 'working'}
            newForm.report = {value: result.report}
            res.send(newForm)
          } else {
            newForm.status = {value: 'not working'}
            newForm.report = {value: result.report}
            res.send(newForm)
          }
        })
      } else {
        newForm.status = {value: 'offline'}
        newForm.report = {value: ''}
        res.send(newForm)
      }
    })
    ;
});

router.post('/api/DBSetup/test-connection', function (req, res, next) {
  let newDetObj = {
    host: req.body.formControls.host.value,
    port: req.body.formControls.port.value,
    database: req.body.formControls.database.value,
    user: req.body.formControls.user.value,
    password: req.body.formControls.password.value
  }
  _db.testConnection(newDetObj)
    .then((data) => { res.send(data) })
    .catch((err) => { res.status(400); console.log(err) });
})


router.post('/api/DBSetup/test-db-availability', function (req, res, next) {
  dbDiagnostics.testDatabaseAvailability(req.body.formControls.database.value)
    .then((data) => { res.send(data) })
    .catch((err) => { res.status(400); console.log(err) });
})

router.post('/api/DBSetup/create-database', function (req, res, next) {
  _db.createNewDatabase(req.body.formControls.database.value)
    .then((data) => {
        res.send(data)
    })
    .catch((err) => { res.status(400); console.log(err) });
})

router.get('/api/DBSetup/recreate-all-tables', function (req, res, next) { 
  _db.createAllTables().then((result) => {res.send(result)})
})

router.post('/api/DBSetup/update-db-info', function (req, res, next) {
  let newDetObj = {
    host: req.body.formControls.host.value,
    port: req.body.formControls.port.value,
    database: req.body.formControls.database.value,
    user: req.body.formControls.user.value,
    password: req.body.formControls.password.value
  }
  _db.testConnection(newDetObj)
    .then((data) => {
      if (data) {
        _db.updateDatabaseDetails(newDetObj).then(() => { res.send(true) })
      }
    })
    .catch((err) => { res.status(400); console.log(err) });

})

const testCurrentDBIntegrity = async (opts) => {
  return (await dbDiagnostics.testDatabaseIntegrity(opts))
}

module.exports = router;