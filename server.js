require('dotenv').config();

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

const noteRouter = require('./routes/noteRoutes.js');
const userRouter = require('./routes/userRoutes.js');
const reminderRouter = require('./routes/reminderRoutes.js');

const conString = process.env.conString;

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(conString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(noteRouter);
app.use(userRouter);
app.use(reminderRouter);

app.listen(3000, () => {
  console.log('Server is running...');
});
