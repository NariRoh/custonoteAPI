const DBErrorParser = err => {
  const errors = [];
  if (err.name === 'MongoError') {
    errors.push('This email is already in use');
  } else {
    for (const error in err.errors) {
      errors.push(err.errors[error].message);
    }
  }

  return errors;
};

const findOrCreateUser = (profile, done) => {
  User.findOne({ email: profile.emails[0].value })
    .then(user => {
      if (user) {
        console.log('user found');
        done(null, user);
      } else {
        new User({
          username: profile.displayName,
          email: profile.emails[0].value,
          thumbnail: profile.photos[0].value
        })
          .generateAuthToken()
          .then(newUser => {
            console.log('created new user', newUser);
            done(null, newUser);
          });
      }
    })
    .catch(err => done(err));
};

module.exports = { DBErrorParser, findOrCreateUser };
