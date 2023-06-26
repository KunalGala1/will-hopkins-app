const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Content = require('../models/Content');
const Event = require('../models/Event');
const { forwardAuthenticated } = require('../config/auth');
const { ensureAuthenticated } = require('../config/auth');

router.get('/', ensureAuthenticated, (req, res) => {
  res.render('cms/dashboard', {
    name: req.user.username,
  });
});

// events

router.get('/events', ensureAuthenticated, async (req, res) => {
  const events = await Event.find();
  res.render('cms/events', {
    events,
  });
});

router.post('/events', ensureAuthenticated, async (req, res) => {
  try {
    const newEvent = await Event.create({
      json: JSON.stringify(req.body),
    });
    res.json({
      success: true,
      newEvent,
      switch: 'new_event',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

router.get('/events/new', ensureAuthenticated, async (req, res) => {
  res.render('cms/events/new_event');
});

router.get('/events/:id/edit', ensureAuthenticated, async (req, res) => {
  const event = await Event.findById(req.params.id);
  res.render('cms/events/edit_event', {
    event,
  });
});

router.put('/events/:id', ensureAuthenticated, async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { json: JSON.stringify(req.body) },
      { new: true }
    );
    res.json({ success: true, updatedEvent, switch: 'edit_event' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

router.delete('/events/:id/delete', ensureAuthenticated, async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      deletedEvent,
      switch: 'delete_event',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

// bio

router.get('/bio', ensureAuthenticated, async (req, res) => {
  const data = await Content.findOne({ name: 'bio' });
  const json = JSON.parse(data.json);
  res.render('cms/bio', {
    quote: json.quote,
    bio: json.bio,
    id: data.id,
  });
});

router.put('/bio/:id', ensureAuthenticated, async (req, res) => {
  try {
    const updatedBio = await Content.findByIdAndUpdate(
      req.params.id,
      { json: JSON.stringify(req.body) },
      { new: true }
    );
    res.json({ success: true, data: updatedBio });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

module.exports = router;
