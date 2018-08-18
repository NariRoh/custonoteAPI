const express = require("express");
const _ = require('lodash');

const User = require('../models/user');

module.exports = express => {
    const router = express.Router();
    
    router.post('/login', (req, res) => {
        const body = _.pick(req.body, ["email", "password"]);

        User.findByCredentials(body.email, body.password).then(user => {
            return user.generateAuthToken().then(token => {
                res.header('x-auth', token).send();
            });
        }).catch(err => {
            res.status(400).send(err);
        });
    });

    return router;
};