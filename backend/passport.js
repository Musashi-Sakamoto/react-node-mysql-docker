const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const passportJWT = require('passport-jwt')
const bcrypt = require('bcrypt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
var user = require('./models').user

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'
}, (jwtPayload, cb) => {
    return user.find({
        where: {
            id: jwtPayload.id
        }
    }).then(user => {
        return cb(null, user)
    }).catch(err => {
        return cb(err)
    })
}))

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, cb) => {
    return user.findOne({
            where: {
                email
            }
        })
        .then(user => {
            if (!user) {
                return cb(null, false, {
                    message: 'Incorrect email'
                })
            }
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    return cb(null, user.toJSON(), {
                        message: 'Logged In Successfully'
                    })
                } else {
                    return cb(null, false, {
                        message: 'Incorrect password.'
                    })
                }
            })
        })
        .catch(err => {
            cb(err)
        })
}))