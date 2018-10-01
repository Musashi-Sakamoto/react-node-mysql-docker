const request = require('supertest')
const app = require('../app')
const expect = require('expect')
const should = require('should')
const server = request.agent('http://localhost:3000')

const loginUser = (auth) => {
    let data = {
        email: 'mockinbird634@yahoo.co.jp',
        password: '66528270'
    }
    return (done) => {
        server
            .post('/auth/login')
            .send(data)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err)
                auth.token = res.body.token
                done()
            })
    }
}

describe('POST /auth/register', () => {
    let data = {
        email: '1292602b@gmail.com',
        password: '1292602b'
    }
    it('respond with 201 register', (done) => {
        request(app)
            .post('/auth/register')
            .send(data)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .expect(res => {
                expect(res.body.user.email).toEqual('1292602b@gmail.com')
                expect(res.body.hasOwnProperty('token')).toBeTruthy()
            })
            .end((err) => {
                if (err) return done(err)
                done()
            })
    })
})

describe('POST /auth/login', () => {
    let data = {
        email: 'mockinbird634@yahoo.co.jp',
        password: '66528270'
    }
    it('respond with 200 loging', (done) => {
        server
            .post('/auth/login')
            .send(data)
            .expect(200)
            .expect(res => {
                expect(res.body.user.email).toEqual('mockinbird634@yahoo.co.jp')
                expect(res.body.hasOwnProperty('token'))
            })
            .end((err) => {
                if (err) return done(err)
                done()
            })
    })
})

describe('POST /employees', () => {
    var auth = {}
    before(loginUser(auth))
    it('should respond with created', (done) => {
        let data = {
            name: 'musashi',
            department: 'A',
            gender: 'male'
        }
        request(app)
            .post('/employees')
            .send(data)
            .set('Authorization', `Bearer ${auth.token}`)
            .expect('Content-Type', /json/)
            .expect(201)
            .end((err) => {
                if (err) return done(err)
                done()
            })
    })

    it('should respond with error', (done) => {
        let data = {
            name: 'musashi',
            department: 'A',
            gender: 'male'
        }
        request(app)
            .post('/employees')
            .send(data)
            .expect(401)
            .end((err) => {
                if (err) return done(err)
                done()
            })
    })
})

describe('GET /employees', () => {
    it('should require authorization', (done) => {
        server
            .get('/employees')
            .expect(401)
            .end((err, res) => {
                if (err) return done(err)
                done()
            })
    })

    var auth = {}
    before(loginUser(auth))

    it('should respond with JSON array', (done) => {
        server
            .get('/employees')
            .set('Authorization', `Bearer ${auth.token}`)
            .expect(200)
            .expect('Content-Type', /json/)
            .end((err, res) => {
                if (err) return done(err)
                res.body.should.be.instanceof(Array)
                done()
            })
    })
})