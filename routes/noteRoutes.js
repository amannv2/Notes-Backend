const express = require('express');
const common = require('../common');
const noteModel = require('../models/noteSchema');

const app = express();

var date = new Date();

// get all notes
app.post('/notes/:user', async (req, res) => {
  const user = req.params.user.trim();
  const pass = req.body.pass;
  const notes = await noteModel.find({ owner: user });
  // console.log(JSON.stringify(notes));

  if ((await common.authenticate(user, pass)) === false) {
    res.status(401).send('Not authorized');
  } else {
    try {
      console.log(date.toLocaleString() + ': Retrieving all notes.');
      res.send(notes);
    } catch (err) {
      console.log(date.toLocaleString() + ': Error in retrieving all notes.');
      res.status(500).send(err);
    }
  }
});

// add new note
app.post('/note/:user', async (req, res) => {
  const note = new noteModel(req.body.note);
  const user = req.params.user.trim();
  const pass = req.body.pass;

  if ((await common.authenticate(user, pass)) === false) {
    res.status(401).send('Not authorized');
  } else {
    try {
      console.log(date.toLocaleString() + ': Adding a new note: ' + note._id);
      note.id = note._id;
      await note.save();
      res.send(note);
    } catch (err) {
      console.log(date.toLocaleString() + ': Error in adding a new note: ' + err);
      res.status(500).send(err);
    }
  }
});

// delete a note
app.delete('/note/:id', async (req, res) => {
  try {
    const note = await noteModel.findByIdAndDelete(req.params.id);

    if (!note) res.status(404).send('No note found');
    console.log(date.toLocaleString() + ': Deleting note: ' + req.params.id);
    res.status(200).send();
  } catch (err) {
    console.log(date.toLocaleString() + ': Error in deleting note: ' + err);
    res.status(500).send(err);
  }
});

// update a note
app.patch('/note/:id/:user', async (req, res) => {
  const user = req.params.user.trim();
  const pass = req.body.pass;

  if ((await common.authenticate(user, pass)) === false) {
    res.status(401).send('Not authorized');
  } else {
    try {
      console.log(date.toLocaleString() + ': Updating note: ' + req.params.id + '.');
      const note = await noteModel.findByIdAndUpdate(req.params.id, req.body.note);
      await note.save();
      res.status(200).send(note);
    } catch (err) {
      console.log(date.toLocaleString() + ': Error in updating note: ' + err);
      res.status(500).send(err);
    }
  }
});

module.exports = app;
