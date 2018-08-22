const expect = require('chai').expect;
const request = require('supertest');

const app = require('../server');
const User = require('../models/user');
const { populateUsers, users } = require('../seed/seed');

describe('/auth', () => {
  describe('/login', () => {
    let user;

    beforeEach(function(done) {
      this.timeout(0);
      user = users[0];
      populateUsers(done);
    });

    it('returns users auth token on successful login', done => {
      request(app)
        .post('/auth/login')
        .send({ email: user.email, password: user.password })
        .expect(200)
        .expect(res => {
          expect(res.headers['x-auth']).to.equal(user.token);
        })
        .end(done);
    });

    it("returns an error message if the password doesn't match", done => {
      request(app)
        .post('/auth/login')
        .send({ email: user.email, password: 'random_password' })
        .expect(400)
        .expect(res => {
          expect(res.error.text).to.equal('password not matched');
        })
        .end(done);
    });

    it('returns an error message if the user does not exist', done => {
      request(app)
        .post('/auth/login')
        .send({ email: 'random@gmail.com', password: 'random_password' })
        .expect(400)
        .expect(res => {
          expect(res.error.text).to.equal('User not found');
        })
        .end(done);
    });
  });
});
