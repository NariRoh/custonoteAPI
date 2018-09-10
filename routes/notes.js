const router = require('express').Router();

const User = require('../models/user');

router.post('/create', (req, res) => {
    const { user, body } = req;
    const note = {
        heading: body.heading,
        body: body.body,
        createdAt: Date.now()
    };

    user.notes.push(note);
    user.save()
        .then(userObj => {
            // reverse the order of the notes and send the latest one (created one)
            userObj.notes.reverse();
            res.json(userObj.notes[0]);
        })
        .catch(err => {
            res.status(400).send(err)
        });
});

module.exports = router;
