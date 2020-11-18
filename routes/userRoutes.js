var bcrypt = require('bcryptjs');
const express = require('express');
const userModel = require('../models/userSchema');

const app = express();

var date = new Date();

// get all users
app.get('/users', async (req, res) => {
  const users = await userModel.find({});

  try {
    console.log(date.toLocaleString() + ': Retrieving all users.');
    res.send(users);
  } catch (err) {
    console.log(date.toLocaleString() + ': Error in retrieving all users.');
    res.status(500).send(err);
  }
});

// get specific user
app.get('/user/:name', async (req, res) => {
  let response = { status: false };
  const name = req.params.name.trim();

  try {
    const user = await userModel.find({ username: name });

    console.log(date.toLocaleString() + ': Retrieving user data of ' + name + '.');

    if (user[0].username === name) {
      response.status = true;
    }

    res.send(response);
  } catch (err) {
    console.log(date.toLocaleString() + ': User does not exists with name ' + name + '.');
    res.status(200).send(response);
  }
});

// authenticate user
app.post('/user/:name', async (req, res) => {
  let response = { status: false };
  const name = req.params.name.trim();
  const pass = req.body.pass.trim();

  try {
    const user = await userModel.find({ username: name });

    console.log(date.toLocaleString() + ': Authenticating user ' + name);

    if (user[0].username === name) {
      const result = await bcrypt.compare(pass, user[0].password);
      if (result) {
        response.status = true;
      }
    }
    res.send(response);
  } catch (err) {
    console.log(date.toLocaleString() + ': User does not exists with name ' + name + '.');
    res.status(200).send(response);
  }
});

// add new user
app.post('/users', async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(req.body.password, salt);

  req.body.password = hash;

  const user = new userModel(req.body);

  try {
    console.log(date.toLocaleString() + ': Adding a new user: ' + req.body.username);
    await user.save();
    res.status(200).send();
  } catch (err) {
    console.log(date.toLocaleString() + ': Error in adding a new user: ' + err);
    res.status(500).send(err);
  }
});

module.exports = app;
