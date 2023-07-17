const express = require('express');
const router = express.Router();

/* Import Models */
const Content = require('../models/Content');
const Event = require('../models/Event');
const Video = require('../models/Video');
const Work = require('../models/Work');

/* Home */
router.get('/', async (req, res) => {
  const quote = await Content.findOne({ name: 'quote' });
  const intro = await Content.findOne({ name: 'intro' });
  const news = await Content.findOne({ name: 'news' });
  res.render('client/index', { quote, intro, news });
});

/* Events */
router.get('/events', async (req, res) => {
  const events = await Event.find();
  res.render('client/events', { events });
});

router.get('/event/:slug', async (req, res) => {
  const events = await Event.find();
  const event = events.find(event => JSON.parse(event.body).slug === req.params.slug);
  if (event == undefined) res.redirect('/events');
  else {
    res.render('client/event', { event });
  }
});

/* Bio */
router.get('/bio', async (req, res) => {
  const data = await Content.findOne({ name: 'bio' });
  if (!data)
    res.render('client/bio', {
      quote: 'db conn failed',
      bio: 'db conn failed',
    });
  else {
    const body = JSON.parse(data.body);
    res.render('client/bio', {
      quote: body.quote,
      bio: body.bio,
    });
  }
});

/* Contact */
router.get('/contact', async (req, res) => {
  res.render('client/contact', { msg: '' });
});

/* Listen */
router.get('/listen', async (req, res) => {
  const videos = await Video.find({});

  res.render('client/listen', { videos });
});

/* Repertoire */
router.get('/repertoire', async (req, res) => {
  const works = await Work.find({});
  const repertoire = await Content.findOne({ name: 'repertoire' });
  res.render('client/works', { works, repertoire });
});

module.exports = router;
