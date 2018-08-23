const express = require("express");
const _ = require('lodash');

const User = require('../models/user');

module.exports = express => {
    const router = express.Router();
    
    router.post('/register', (req, res) => {
        let user = new User();
        const body = _.pick(req.body, ["email", "password"]);

        // When someone registers:
        // TODO: Hash the password
        // TODO: Create a token
        // TODO: Add the user to the db  

        user.email = body.email;
        user.password = body.password;
        
    });
    
    return router;
}; 