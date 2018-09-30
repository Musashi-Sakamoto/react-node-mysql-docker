const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const passport = require('passport')

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