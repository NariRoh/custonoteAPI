const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const ids = [];

for (let index = 0; index < 4; index++) {
  ids.push(new ObjectID());
}

const users = [
  {
    _id: ids[0],
    username: 'Jethro',
    email: 'jethro@gmail.com',
    local: {
      password: 'password1'
    },
    token: jwt.sign({ _id: ids[0] }, process.env.JWT_SECRET)
  },
  {
    _id: ids[1],
    username: 'NariRoh',
    email: 'nariroh@gmail.com',
    local: {
      password: 'password2'
    },
    token: jwt.sign({ _id: ids[1] }, process.env.JWT_SECRET)
  },
  {
    _id: ids[2],
    username: 'JonMaldia',
    email: 'jonmaldia@gmail.com',
    local: {
      password: 'password3'
    },
    token: jwt.sign({ _id: ids[2] }, process.env.JWT_SECRET)
  },
  {
    _id: ids[3],
    username: 'Alexever',
    email: 'alexever@gmail.com',
    local: {
      password: 'password4'
    },
    token: jwt.sign({ _id: ids[3] }, process.env.JWT_SECRET)
  }
];

const populateUsers = done => {
  User.remove({})
    .then(() => {
      return User.create(users);
    })
    .then(() => {
      if (done) {
        done();
      } else {
        console.log('DB populated');
      }
    })
    .catch(err => console.log(err));
};

const notes = [
  {
    body: 'This a test',
    heading: 'Test 1'
  },
  {
    body: 'The quick brown fox jumps over the lazy dog',
    heading: 'Test 2'
  },
  {
    body: 'Peter Piper picked a peck of pickled peppers',
    heading: 'Test 3'
  }
];

module.exports = { populateUsers, users, notes };
