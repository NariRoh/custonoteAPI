const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;

mongoose.connect(
  uri,
  () => {
    console.log(`DB is live at ${uri}`);
  }
);

module.exports = mongoose;
