const express = require("express");

module.exports = function (express) {
    const router = express.Router();
    
    router.post('/login', (req, res) => {
        res.send(req.body);
        console.log('test', req.body)
    });

    return router;
};