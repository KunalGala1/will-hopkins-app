const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const Event = require('../models/Event');

router.get('/', async (req, res) => {
  const quote = await Content.findOne({ name: 'quote' });
  const intro = await Content.findOne({ name: 'intro' });
  const news = await Content.findOne({ name: 'news' });
  res.render('index', { quote, intro, news });
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
  if (event == undefined) res.redirect('/events');
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
