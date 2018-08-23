const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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
      message: "{VALUE} is not a valid email"
    },
    required: true
  },
  password: {
    type: String,
    required: true
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

UserSchema.pre("save", function(next) {
  const user = this;

  if (user.isModified("password")) {
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

const User = mongoose.model("User", UserSchema);

module.exports = User;