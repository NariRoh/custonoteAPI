require('dotenv').config();

const passport = require('passport');
const passportJWT = require('passport-jwt');
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('../models/user');
const { findOrCreateUser } = require('../utils/utils');

const ExtractJwt = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

// const JwtStrategy = new JWTStrategy(options, (payload, next) => {
passport.use(
  new JWTStrategy(options, (payload, next) => {
    // console.log('payload received', payload);
    const id = payload._id;
    User.findById(id).then(user => {
      // console.log('user', user);
      if (user) {
          next(null, user);
      } else {
          next(null, false);
      }
    });
  })
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: '/auth/github/redirect'
    },
    (accessToken, refreshToken, profile, done) => {
      process.nextTick(() => {
        findOrCreateUser(profile, done);
      });
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/redirect'
    },
    (accessToken, refreshToken, profile, done) => {
      process.nextTick(() => {
        findOrCreateUser(profile, done);
      });
    }
  )
);

// module.exports = {
//   JwtStrategy
// };
