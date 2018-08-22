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
    password: 'password1',
    token: jwt.sign({ id: ids[0] }, process.env.JWT_SECRET)
    // token: null
  },
  {
    _id: ids[1],
    username: 'NariRoh',
    email: 'nariroh@gmail.com',
    password: 'password2',
    // token: jwt.sign({ id: ids[1] }, process.env.JWT_SECRET)
    token: null
  },
  {
    _id: ids[2],
    username: 'JonMaldia',
    email: 'jonmaldia@gmail.com',
    password: 'password3',
    token: jwt.sign({ id: ids[2] }, process.env.JWT_SECRET)
    // token: null
  },
  {
    _id: ids[3],
    username: 'Alexever',
    email: 'alexever@gmail.com',
    password: 'password4',
    token: jwt.sign({ id: ids[3] }, process.env.JWT_SECRET)
    // token: null
  }
];

const populateUsers = done => {
  User.remove({})
    .then(() => {
      return User.create(users);
    })
    .then(() => {
      if (done) done();
      console.log('DB populated');
    })
    .catch(err => console.log(err));
};

module.exports = { populateUsers, users };
