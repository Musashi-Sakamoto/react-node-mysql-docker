var express = require('express');
var router = express.Router();

var models = require('../models')

/* GET home page. */
router.get('/', function (req, res, next) {
  models.employee.all().then(employees => {
    res.render('index', {
      title: employees.length
    });
  })
});

module.exports = router;