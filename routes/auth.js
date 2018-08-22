const express = require("express");
const _ = require('lodash');

const User = require('../models/user');

module.exports = express => {
    const router = express.Router();
    
    router.post('/register', (req, res) => {
        const body = _.pick(req.body, ["email", "password"]);

    
    });
    
    return router;
}; 