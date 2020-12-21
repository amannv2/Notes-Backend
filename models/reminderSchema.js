const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
  id: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    default: '',
  },
  time: {
    type: Date,
  },
  owner: {
    type: String,
    required: true,
  },
});

const Reminder = mongoose.model('Reminder', ReminderSchema);
module.exports = Reminder;
