var express = require('express')
var router = express.Router()

var models = require('../models')

router.get('/', function (req, res, next) {
    models.employee.all().then(employees => {
        res.json(employees)
    })
})

router.post('/', function (req, res, next) {
    models.employee.create({
        name: req.body.name,
        department: req.body.department,
        gender: req.body.gender
    }).then(result => {
        res.status(201)
        res.send(result)
    }).catch(err => {
        res.status(409)
        res.send(err)
    })
})

module.exports = router