/* Import Required Modules */
const express = require('express');
const router = express.Router();
const passport = require('passport');

/* Import Models */
const Video = require('../models/Video');

/* Import Auth Configs */
const { forwardAuthenticated } = require('../config/auth');
const { ensureAuthenticated } = require('../config/auth');

/* Listen */
router.get('/', ensureAuthenticated, async (req, res) => {
  const videos = await Video.find({});
  res.render('admin/listen', { videos });
});

/* New listen Page */
router.get('/new', ensureAuthenticated, async (req, res) => {
  res.render('admin/listen/new_video');
});

/* New listen */
router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    const newVideo = await Video.create({
      body: JSON.stringify(req.body),
    });
    res.json({
      success: true,
      newVideo,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

/* Edit Video Page */
router.get('/:id/edit', ensureAuthenticated, async (req, res) => {
  const video = await Video.findById(req.params.id);
  res.render('admin/listen/edit_video', {
    video,
  });
});

/* Get One listen */
router.get('/:id', ensureAuthenticated, async (req, res) => {
  const video = await Video.findById(req.params.id);
  res.json({ success: true, video });
});

/* Edit listen */
router.put('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const updatedVideo = await Video.findByIdAndUpdate(req.params.id, { body: JSON.stringify(req.body) }, { new: true });
    res.json({ success: true, updatedVideo });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

/* Delete listen */
router.delete('/:id/delete', ensureAuthenticated, async (req, res) => {
  try {
    const deletedVideo = await Video.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      deletedVideo,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

module.exports = router;
