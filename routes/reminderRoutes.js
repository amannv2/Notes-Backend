const express = require('express');
const common = require('../common');
const reminderModel = require('../models/reminderSchema');

const app = express();

var date = new Date();

// get all reminders
app.post('/reminders/:user', async (req, res) => {
  const user = req.params.user.trim();
  const pass = req.body.pass;
  const reminders = await reminderModel.find({ owner: user });
  // console.log(JSON.stringify(reminders));

  if ((await common.authenticate(user, pass)) === false) {
    res.status(401).send('Not authorized');
  } else {
    try {
      console.log(date.toLocaleString() + ': Retrieving all reminders.');
      res.send(reminders);
    } catch (err) {
      console.log(date.toLocaleString() + ': Error in retrieving all reminders.');
      res.status(500).send(err);
    }
  }
});

// add new reminder
app.post('/reminder/:user', async (req, res) => {
  const reminder = new reminderModel(req.body.reminder);
  const user = req.params.user.trim();
  const pass = req.body.pass;

  if ((await common.authenticate(user, pass)) === false) {
    res.status(401).send('Not authorized');
  } else {
    try {
      console.log(date.toLocaleString() + ': Adding a new reminder: ' + reminder._id);
      reminder.id = reminder._id;
      await reminder.save();
      res.send(reminder);
    } catch (err) {
      console.log(date.toLocaleString() + ': Error in adding a new reminder: ' + err);
      res.status(500).send(err);
    }
  }
});

// delete a reminder
app.delete('/reminder/:id', async (req, res) => {
  try {
    const reminder = await reminderModel.findByIdAndDelete(req.params.id);

    if (!reminder) res.status(404).send('No reminder found');
    console.log(date.toLocaleString() + ': Deleting reminder: ' + req.params.id);
    res.status(200).send();
  } catch (err) {
    console.log(date.toLocaleString() + ': Error in deleting reminder: ' + err);
    res.status(500).send(err);
  }
});

// update a reminder
app.patch('/reminder/:id/:user', async (req, res) => {
  const user = req.params.user.trim();
  const pass = req.body.pass;

  if ((await common.authenticate(user, pass)) === false) {
    res.status(401).send('Not authorized');
  } else {
    try {
      console.log(date.toLocaleString() + ': Updating reminder: ' + req.params.id + '.');
      const reminder = await reminderModel.findByIdAndUpdate(req.params.id, req.body.reminder);
      await reminder.save();
      res.status(200).send(reminder);
    } catch (err) {
      console.log(date.toLocaleString() + ': Error in updating reminder: ' + err);
      res.status(500).send(err);
    }
  }
});

module.exports = app;
