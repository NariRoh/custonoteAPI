const expect = require('chai').expect;
const request = require('supertest');

const app = require('../server');
const User = require('../models/user');
const { populateUsers, users, notes } = require('../seed/seed');

describe('/notes', () => {
  let note, user;

  beforeEach(function(done) {
    this.timeout(0);
    user = users[1];
    populateUsers(done);
    user.notes = notes;
  });

  describe('/create', () => {
    it('creates a new note', done => {
      note = notes[0];
      request(app)
        .post('/notes/create')
        .set('Authorization', `Bearer ${user.token}`)
        .send(note)
        .expect(200)
        .expect(res => {
          expect(res.body.body).to.equal(note.body);
          expect(res.body.heading).to.equal(note.heading);
        })
        .end(done);
    });

    it('returns an error for unauthorised requests', done => {
      note = notes[1];
      request(app)
        .post('/notes/create')
        .send(note)
        .expect(401)
        .end(done);
    });

    it('returns an error for invalid values', done => {
      request(app)
        .post('/notes/create')
        .send({})
        .set('Authorization', `Bearer ${user.token}`)
        .expect(400)
        .expect(res => {
          const errors = res.body;
          expect(errors.length).to.equal(2);
        })
        .end(done);
    });
  });

  describe('PATCH /edit/:id', () => {
    it('should update the note', done => {
      note = user.notes[0];
      const hexId = note._id.toHexString();
      const body = 'Edited body'

      request(app)
        .patch(`/notes/edit/${hexId}`)
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          body,
          pinned: true
        })
        .expect(200)
        .expect(res => {
          expect(res.body.body).to.equal(body);
          expect(res.body.pinned).to.equal(true);
          expect(res.body.previousVersion).to.equal(note.body);
          expect(res.body.lastUpdatedAt).not.to.equal(res.body.createdAt);
        })
        .end(done);
    });

    it('should returns an error for unauthorised requests', done => {
      const hexId = notes[1]._id.toHexString();

      request(app)
        .patch(`/notes/edit/${hexId}`)
        .send({
          heading: 'Updated heading',
          body: 'Updated body'
        })
        .expect(401)
        .end(done);
    });
  });

  describe('GET /', () => {
    it('should get all notes', done => {
      const noteLen = user.notes.length;
      
      request(app)
        .get('/notes')
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200)
        .expect(res => {
          expect(res.body.length).to.equal(noteLen);
        })
        .end(done);
    });
  });
});
