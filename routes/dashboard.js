/* Import Required Modules */
const express = require('express');
const router = express.Router();
const passport = require('passport');

/* Import Models */
const Content = require('../models/Content');
const Event = require('../models/Event');
const Work = require('../models/Work');
const Video = require('../models/Video');

/* Import Auth Configs */
const { forwardAuthenticated } = require('../config/auth');
const { ensureAuthenticated } = require('../config/auth');

/* Dashboard */
router.get('/', ensureAuthenticated, async (req, res) => {
  const quote = await Content.findOne({ name: 'quote' });
  const intro = await Content.findOne({ name: 'intro' });
  const news = await Content.findOne({ name: 'news' });

  res.render('admin/dashboard', {
    name: req.user.username,
    quote,
    intro,
    news,
  });
});

/* Edit Quote */
router.put('/quote/:id', ensureAuthenticated, async (req, res) => {
  try {
    const data = await Content.findByIdAndUpdate(req.params.id, { body: JSON.stringify(req.body) }, { new: true });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

/* Edit Intro */
router.put('/intro/:id', ensureAuthenticated, async (req, res) => {
  try {
    const data = await Content.findByIdAndUpdate(req.params.id, { body: JSON.stringify(req.body) }, { new: true });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

/* Edit News */
router.put('/news/:id', ensureAuthenticated, async (req, res) => {
  try {
    const data = await Content.findByIdAndUpdate(req.params.id, { body: JSON.stringify(req.body) }, { new: true });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

/* Bio */
router.get('/bio', ensureAuthenticated, async (req, res) => {
  const data = await Content.findOne({ name: 'bio' });
  const body = JSON.parse(data.body);
  res.render('admin/bio', {
    quote: body.quote,
    bio: body.bio,
    id: data.id,
  });
});

/* Edit Bio */
router.put('/bio/:id', ensureAuthenticated, async (req, res) => {
  try {
    const updatedBio = await Content.findByIdAndUpdate(req.params.id, { body: JSON.stringify(req.body) }, { new: true });
    res.json({ success: true, data: updatedBio });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

// ====================================================================================================

const models = [
  {
    name: 'events',
  },
  {
    name: 'listen',
    model: 'videos',
  },
  {
    name: 'works',
  },
];

const Singular_and_Uppercase = string => {
  return string.slice(0, -1).charAt(0).toUpperCase() + string.slice(0, -1).slice(1);
};

models.forEach(model => {
  /* Define Variables */
  const name = model.name;
  const collection = model.model ? model.model : name;
  const modelName = Singular_and_Uppercase(collection);

  /* Get page */
  router.get('/' + model.name, ensureAuthenticated, async (req, res) => {
    const data = await eval(modelName).find({});
    res.render('admin/' + model.name, { [collection]: data });
  });

  /* Add new page */
  router.get('/' + model.name + '/new', ensureAuthenticated, (req, res) => {
    res.render('admin/' + model.name + '/new_' + modelName.toLowerCase());
  });
});

module.exports = router;
