const expect = require('chai').expect;
const request = require('supertest');

const app = require('../server');
const User = require('../models/user');
const { populateUsers, users } = require('../seed/seed');

describe('/auth', () => {
  let user;

  beforeEach(function(done) {
    this.timeout(0);
    user = users[0];
    populateUsers(done);
  });

  describe('/login', () => {
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

  describe('/register', () => {
    it('should add a new user to the database', done => {
      user = {
        username: 'user123',
        password: 'mypassword',
        email: 'iamuser@gmail.com'
      };

      request(app)
        .post('/auth/register')
        .send({
          email: user.email,
          password: user.password,
          username: user.username
        })
        .expect(200)
        .expect(res => {
          expect(res.body.email).to.equal(user.email);
          expect(res.headers['x-auth']).to.be.a('string');
        })
        .end(err => {
          if (err) {
            return done(err);
          }

          User.findOne({ email: user.email })
            .then(dbUser => {
              expect(dbUser.password).to.not.equal(user.password);
              done();
            })
            .catch(err => done(err));
        });
    });

    it('should return an error for invalid values', done => {
      user = {
        username: 'Todd',
        password: 'short',
        email: 'invalid'
      };

      request(app)
        .post('/auth/register')
        .send({
          email: user.email,
          password: user.password,
          username: user.username
        })
        .expect(400)
        .expect(res => {
          const errors = res.body.errors;
          expect(errors.length).to.equal(2);
        })
        .end(done);
    });

    it('should return an error for duplicate emails', done => {
      user = {
        username: 'Celeste',
        password: 'celeste1234',
        email: users[1].email
      };

      request(app)
        .post('/auth/register')
        .send({
          email: user.email,
          password: user.password,
          username: user.username
        })
        .expect(400)
        .expect(res => {
          const errors = res.body.errors;
          expect(errors[0]).to.equal('This email is already in use');
        })
        .end(done);
    });
  });
});
