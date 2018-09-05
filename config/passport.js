const passportJWT = require('passport-jwt');

const User = require('../models/user');

const ExtractJwt = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

const JwtStrategy = new JWTStrategy(options, (payload, next) => {
  console.log('payload received', payload);
  const id = payload.id;
  User.findOne({ _id: id }).then(user => {
    console.log('user', user);
    if (user) {
      next(null, user);
    } else {
      next(null, false);
    }
  });
});

module.exports = {
  JwtStrategy
};
