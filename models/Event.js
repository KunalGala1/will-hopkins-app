const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  url: { type: String, required: true },
  lastmod: { type: Date, default: Date.now },
  changefreq: { type: String, default: "daily" },
  priority: { type: Number, default: 0.9 },
  body: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Event", EventSchema, "events");
