const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 6
  },
  email: {
    type: String,
    validate: {
      validator: validator.isEmail,
      message: '"{VALUE}" is not a valid email'
    },
    required: true,
    unique: true
  },
  local: {
    password: {
      type: String,
      required: true
    }
  },
  github: {
    githubID: {
      type: String,
      required: true
    }
  },
  google: {
    googleID: {
      type: String,
      required: true
    },
    thumbnail: {
      type: String,
      validate: {
        validator: validator.isURL,
        message: '"{VALUE}" is not a valid url'
      }
    }
  },
  facebook: {
    facebookID: {
      type: String,
      required: true
    },
    thumbnail: {
      type: String,
      validate: {
        validator: validator.isURL,
        message: '"{VALUE}" is not a valid url'
      }
    }
  },
  token: {
    type: String,
    required: true
  },
  notes: [
    {
      heading: {
        type: String,
        required: true
      },
      body: {
        type: String,
        required: true,
        text: true
      },
      pinned: {
        type: Boolean,
        default: false
      },
      createdAt: {
        type: Number,
        required: true
      },
      lastUpdatedAt: {
        type: Number
      },
      previousVersion: {
        type: String,
        text: true
      },
      archived: {
        type: Boolean,
        default: false
      }
    }
  ]
});

UserSchema.methods.toJSON = function() {
  const user = this;
  const userObj = user.toObject();

  return _.pick(userObj, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function() {
  const user = this;
  const generatedToken = jwt
    .sign({ _id: user._id }, process.env.JWT_SECRET)
    .toString();

  user.token = generatedToken;

  return user.save().then(() => generatedToken);
};

UserSchema.statics.findByCredentials = function(email, password) {
  const User = this;

  return User.findOne({ email }).then(user => {
    if (!user) {
      return Promise.reject('User not found');
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        res ? resolve(user) : reject('password not matched');
      });
    });
  });
};

UserSchema.pre('save', function(next) {
  const user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
