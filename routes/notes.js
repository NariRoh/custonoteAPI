const router = require('express').Router();
const jwt = require('jsonwebtoken');

const User = require('../models/user');

router.post('/create', (req, res) => {
    console.log('===========user===========', req.user)    
    // const note = {
    //     heading: req.body.heading,
    //     body: req.body.body,
    //     createdAt: new Date()
    // };
    // const user = 

    // user.notes = note;
    // user.save().then(note => {
    //     res.json(note);
    // }, err => {
    //     res.status(400).send(err);
    // });
});

module.exports = router;
