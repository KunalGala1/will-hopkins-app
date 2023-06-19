const express = require('express');
const router = express.Router();
const Content = require('../models/Content');

router.get('/', async (req, res) => {
  res.render('index');
});

router.get('/events', async (req, res) => {
  res.render('events');
});

router.get('/bio', async (req, res) => {
  const data = await Content.findOne({ name: 'bio' });
  console.log(data);
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
