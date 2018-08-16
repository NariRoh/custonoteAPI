require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const populateUsers = require("./seed/seed");

const app = express();

const port = process.env.PORT || 3000;
app.use(bodyParser.json());

app.listen(port, () => {
  require("./db/mongoose");
  populateUsers();
});
