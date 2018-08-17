require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const populateUsers = require("./seed/seed");

// Importing routes
const authRoutes = require("./routes/auth")(express);

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use("/auth", authRoutes);

app.listen(port, () => {
  require("./db/mongoose");
  populateUsers();
});
