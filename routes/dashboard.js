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

const ContentDocuments = [{ name: 'quote' }, { name: 'intro' }, { name: 'news' }, { name: 'bio' }, { name: 'repertoire' }];

ContentDocuments.forEach(document => {
  const name = document.name;
  router.put('/' + name + '/:id', ensureAuthenticated, async (req, res) => {
    try {
      const updatedDocument = await Content.findByIdAndUpdate(
        req.params.id,
        {
          body: JSON.stringify(req.body),
        },
        {
          new: true,
        }
      );
      res.json({
        success: true,
        updatedDocument,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Something went wrong',
      });
    }
  });
});

/* Bio */
router.get('/bio', ensureAuthenticated, async (req, res) => {
  const data = await Content.findOne({ name: 'bio' });
  res.render('admin/bio', { data });
});

/* Works */

// ====================================================================================================

const Models = [
  {
    name: 'events',
  },
  {
    name: 'listen',
    model: 'videos',
  },
  {
    name: 'works',
    content: 'repertoire',
  },
];

const Singular_and_Uppercase = string => {
  return string.slice(0, -1).charAt(0).toUpperCase() + string.slice(0, -1).slice(1);
};

Models.forEach(model => {
  /* Define variables */
  const name = model.name;
  const collection = model.model ? model.model : name;
  const modelName = Singular_and_Uppercase(collection);
  const singularDocument = modelName.toLowerCase();
  const content = model.content ? model.content : '';

  /* Get collection page */
  router.get('/' + name, ensureAuthenticated, async (req, res) => {
    let contentDocument;
    if (content) {
      contentDocument = await Content.findOne({ name: model.content });
    }

    const data = await eval(modelName).find({});
    const renderOptions = { [collection]: data };

    if (contentDocument) {
      renderOptions[content] = contentDocument;
    }

    res.render('admin/' + name, renderOptions);
  });

  /* Add new document page */
  router.get('/' + name + '/new', ensureAuthenticated, (req, res) => {
    res.render('admin/' + name + '/new_' + singularDocument);
  });

  /* Add new document */
  router.post('/' + name, ensureAuthenticated, async (req, res) => {
    try {
      const newDocument = await eval(modelName).create({
        body: JSON.stringify(req.body),
      });
      res.json({
        success: true,
        newDocument,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Something went wrong' });
    }
  });

  /* Edit document page */
  router.get('/' + name + '/:id/edit', ensureAuthenticated, async (req, res) => {
    const document = await eval(modelName).findById(req.params.id);
    res.render('admin/' + name + '/edit_' + singularDocument, {
      [singularDocument]: document,
    });
  });

  /* Get document */
  router.get('/' + name + '/:id', ensureAuthenticated, async (req, res) => {
    const document = await eval(modelName).findById(req.params.id);
    res.json({ success: true, document });
  });

  /* Edit document */
  router.put('/' + name + '/:id', ensureAuthenticated, async (req, res) => {
    try {
      const updatedDocument = await eval(modelName).findByIdAndUpdate(
        req.params.id,
        {
          body: JSON.stringify(req.body),
        },
        {
          new: true,
        }
      );
      res.json({ success: true, updatedDocument });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Something went wrong',
      });
    }
  });

  /* Delete document */
  router.delete('/' + name + '/:id/delete', ensureAuthenticated, async (req, res) => {
    try {
      const deletedDocument = await eval(modelName).findByIdAndDelete(req.params.id);
      res.json({
        success: true,
        deletedDocument,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Something went wrong',
      });
    }
  });
});

module.exports = router;
