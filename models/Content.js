const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  json: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Content', ContentSchema, 'contents');
