const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  id: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: '#0e9aa7',
  },
  locked: {
    type: Boolean,
    default: false,
  },
  pinned: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: String,
    required: true,
  },
});

const Note = mongoose.model('Note', NoteSchema);
module.exports = Note;
