const app = require('../app')
const request = require('supertest')
const User = require('../../src/api/models/user')
const faker = require('faker')
const i18n = require('../../src/utils/i18n')
const expect = require('expect')

var testUserId = undefined
var token = undefined

const testUser = {
  firstname: faker.name.firstName(),
  lastname: faker.name.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password()
}

// Drops the users collection before testing
before((done) => {
  User.remove({}).then(() => {
    done()
  })
})

describe('Users Api', () => {

  it('Create new user', (done) => {
    request(app)
    .post('/users')
    .send(testUser)
    .expect(200)
    .expect((res) => {
      testUserId = res.body.id
    })
    .end(done)
  })

  it('Should not be able to create user with same email', (done) => {
    request(app)
    .post('/users')
    .send(testUser)
    .expect(400)
    .expect({
      error: i18n.__('user.email.exists')
    }, done)
  })  

  it('Login', (done) => {
    request(app)
    .post('/login')
    .send({
      email: testUser.email,
      password: testUser.password
    })
    .expect(200)
    .expect((res) => {
      const userObject = res.body.user
      token = res.body.token
      expect(userObject).toEqual({
        firstname: testUser.firstname,
        lastname: testUser.lastname,
        email: testUser.email,
        id: testUserId
      })
    })
    .end(done)
  })

  it('Get new user', (done) => {
    request(app)
    .get(`/users/${testUserId}`)
    .expect(200)
    .expect({
      firstname: testUser.firstname,
      lastname: testUser.lastname,
      email: testUser.email,
      id: testUserId
    }, done)
  })

  it('Get users', (done) => {
    request(app)
    .get('/users')
    .expect(200)
    .expect([{
      firstname: testUser.firstname,
      lastname: testUser.lastname,
      email: testUser.email,
      id: testUserId
    }], done)
  })

})

