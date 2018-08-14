const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;

mongoose.Promise = global.Promise;

mongoose.connect(
  uri,
  () => {
    console.log(`DB is live at ${uri}`);
  }
);

module.exports = mongoose;
