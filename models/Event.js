const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  json: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Event', EventSchema, 'events');
