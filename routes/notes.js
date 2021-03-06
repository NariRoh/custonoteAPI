const router = require('express').Router();
const { ObjectID } = require('mongodb');

const User = require('../models/user');
const { DBErrorParser } = require('../utils/utils');

// POST routes
router.post('/create', (req, res) => {
  const { user, body } = req;
  const note = {
    heading: body.heading,
    body: body.body
  };

  user.notes.push(note);
  user
    .save()
    .then(userObj => {
      // reverse the order of the notes and send the latest one (created one)
      userObj.notes.reverse();
      res.json(userObj.notes[0]);
    })
    .catch(err => {
      const errors = DBErrorParser(err);
      res.status(400).send(errors);
    });
});

// GET route
router.get('/', (req, res) => {
  try {
    const { notes } = req.user;
    const sortedNotes = notes.sort((a, b) => {
      return b.createdAt - a.createdAt
    });

    res.json(sortedNotes);

  } catch (err) {
    const errors = DBErrorParser(err);
    res.status(400).send(errors);
  }
});

// PATCH routes
router.patch('/edit/:id', (req, res) => {
  const _id = req.params.id;
  const updates = req.body;
  const user = req.user;
  let noteIndex;

  let note = user.notes
    .find((note, index) => {
      if (note._id.toHexString() === _id) {
        noteIndex = index;
        return true;
      }
      return false;
    })
    
  if (!note) {
    return res.status(404).send('Note not found');
  } 
  
  note = note.toObject();
  const previousVersion = note.body;

  note = {
    ...note,
    ...updates,
    previousVersion,
    lastUpdatedAt: new Date()
  };

  user.notes[noteIndex] = note;

  user
    .save()
    .then(user => {
      const note = user.notes[noteIndex];
      res.send(note);
    })
    .catch(err => {
      const errors = DBErrorParser(err);
      res.status(400).send(errors);
    });
});

module.exports = router;
