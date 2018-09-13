const router = require('express').Router();
const _ = require('lodash');
const passport = require('passport');

const User = require('../models/user');
const { DBErrorParser } = require('../utils/utils');

router.post('/login', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password)
    .then(user => {
      res.header('x-auth', user.token).send();
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

router.post('/register', (req, res) => {
  const body = _.pick(req.body, ['username', 'email']);
  body.local = {
    password: req.body.password
  };
  let user = new User(body);

  user
    .generateAuthToken()
    .then(token => {
      res.header('x-auth', token).send(user);
    })
    .catch(err => {
      const errors = DBErrorParser(err);
      res.status(400).send({ errors });
    });
});

router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get(
  '/github/redirect',
  passport.authenticate('github', {
    // 👇 uncomment when we have those routes
    // failureRedirect: "/login",
    // successRedirect: "/",
    session: false
  }),
  (req, res) => {
    res.send('Logged in with github');
  }
);

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/redirect',
  passport.authenticate('google', {
    // 👇 uncomment when we have those routes
    // failureRedirect: '/login',
    // successRedirect: '/',
    session: false
  }),
  (req, res) => {
    res.send('Logged in with google');
  }
);

module.exports = router;
