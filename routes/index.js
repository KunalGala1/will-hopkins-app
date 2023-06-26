const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const Event = require('../models/Event');

router.get('/', async (req, res) => {
  res.render('index');
});

router.get('/events', async (req, res) => {
  const events = await Event.find();
  res.render('events', { events });
});

router.get('/event/:slug', async (req, res) => {
  const events = await Event.find();
  const event = events.find(
    event => JSON.parse(event.json).slug === req.params.slug
  );
  if (!event) res.render('event', { event: 'db conn failed' });
  else {
    res.render('event', { event });
  }
});

/* Bio */
router.get('/bio', async (req, res) => {
  const data = await Content.findOne({ name: 'bio' });
  if (!data)
    res.render('bio', { quote: 'db conn failed', bio: 'db conn failed' });
  else {
    const json = JSON.parse(data.json);
    res.render('bio', {
      quote: json.quote,
      bio: json.bio,
    });
  }
});

router.get('/contact', async (req, res) => {
  res.render('contact');
});

router.get('/listen', async (req, res) => {
  res.render('listen');
});

module.exports = router;
