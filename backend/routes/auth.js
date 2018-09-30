const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const passport = require('passport')
const bcrypt = require('bcrypt')
var user = require('../models').user

router.post('/register', (req, res, next) => {
    var email = req.body.email
    var password = req.body.password

    bcrypt.hash(password, 12)
        .then(hash => {
            return user.create({
                email: email,
                password: hash
            })
        })
        .then(user => {
            const token = jwt.sign(user.toJSON(), 'your_jwt_secret', {
                expiresIn: '30 days'
            })
            res.json({
                user,
                token
            })
        })
        .catch(err => {
            res.status(400).json({
                message: `${err}`
            })
        })
})

router.post('/login', (req, res, next) => {

    passport.authenticate('local', {
        session: false
    }, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: `${err}`,
                user
            })
        }
        req.login(user, {
            session: false
        }, (err) => {
            if (err) {
                res.send(err)
            }
            const token = jwt.sign(user, 'your_jwt_secret', {
                expiresIn: '30 days'
            })
            return res.json({
                user,
                token
            })
        })
    })(req, res)
})

router.get('/logout', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    req.logout()
    res.status(200).json({
        user: null,
        token: null
    })
})

module.exports = router