const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const passportJWT = require('passport-jwt')
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
    return user.findOrCreate({
            where: {
                email,
                password
            }
        })
        .then(user => {
            if (!user) {
                return cb(null, false, {
                    message: 'Incorrect email or password.'
                })
            }
            return cb(null, user, {
                message: 'Logged In Successfully'
            })
        })
        .catch(err => {
            cb(err)
        })
}))