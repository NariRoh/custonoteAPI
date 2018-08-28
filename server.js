const env = process.env.NODE_ENV || 'development';

if (env === 'test') {
  require('dotenv').config({ path: './.env.test' });
} else if (env === 'development') {
  require('dotenv').config();
}

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const passportSetup = require("./config/passport");
// const { populateUsers } = require("./seed/seed");

// Importing routes
const authRoutes = require('./routes/auth');

const app = express();
const port = process.env.PORT || 3000;

app.use(passport.initialize());
app.use(bodyParser.json());
app.use('/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server is live on ${port}`);
  require('./db/mongoose');
  // populateUsers();
});

module.exports = app;