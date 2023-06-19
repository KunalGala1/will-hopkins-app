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
  console.log(Content);
  const data = await Content.findOne({ name: 'bio' });
  console.log(await Content.find());
  const json = JSON.parse(data.json);
  res.render('bio', {
    quote: json.quote,
    bio: json.bio,
  });
});

router.get('/contact', async (req, res) => {
  res.render('contact');
});

router.get('/listen', async (req, res) => {
  res.render('listen');
});

module.exports = router;
