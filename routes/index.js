const express = require("express");
const router = express.Router();

/* Import Models */
const Content = require("../models/Content");
const Event = require("../models/Event");
const Video = require("../models/Video");
const Work = require("../models/Work");

/* Home */
router.get("/", async (req, res) => {
  const quote = await Content.findOne({ name: "quote" });
  const intro = await Content.findOne({ name: "intro" });
  const news = await Content.findOne({ name: "news" });
  res.render("client/index", { quote, intro, news });
});

/* Events */
router.get("/events", async (req, res) => {
  const eventsUnsorted = await Event.find();
  // order by date
  const events = eventsUnsorted.sort((a, b) => {
    const aBody = JSON.parse(a.body);
    const bBody = JSON.parse(b.body);
    return new Date(bBody.date) - new Date(aBody.date);
  });
  res.render("client/events", { events });
});

router.get("/events/:slug", async (req, res) => {
  const events = await Event.find();
  const event = events.find(
    (event) => JSON.parse(event.body).slug === req.params.slug
  );
  if (event == undefined) res.redirect("/events");
  else {
    res.render("client/event", { event });
  }
});

/* Bio */
router.get("/bio", async (req, res) => {
  const list = ["bio", "repertoire"];
  const docs = [];
  for (let i = 0; i < list.length; i++) {
    const doc = await Content.findOne({ name: list[i] });
    docs.push(doc);
  }
  const data = await Work.find({});
  data.sort((a, b) => {
    const aBody = JSON.parse(a.body);
    const bBody = JSON.parse(b.body);

    // Compare by tag
    if (aBody.tag !== bBody.tag) {
      return aBody.tag.localeCompare(bBody.tag); // if tags can be in any order, then this step can be skipped.
    }

    const returnComposerLastName = (composerName) => {
      const nameParts = composerName.trim().split(/\s+/);
      return nameParts[nameParts.length - 1];
    };

    // Compare by composer
    if (aBody.composer !== bBody.composer) {
      return returnComposerLastName(aBody.composer).localeCompare(
        returnComposerLastName(bBody.composer)
      );
    }

    // Compare by year
    return aBody.year - bBody.year;
  });

  console.log(data);

  res.render("client/bio", { docs, data });
});

/* Contact */
router.get("/contact", async (req, res) => {
  res.render("client/contact", { msg: "" });
});

/* Listen */
router.get("/listen", async (req, res) => {
  const videos = await Video.find({});

  res.render("client/listen", { videos });
});

/* Repertoire */
router.get("/repertoire", async (req, res) => {
  const works = await Work.find({});
  const repertoire = await Content.findOne({ name: "repertoire" });
  res.render("client/works", { works, repertoire });
});

module.exports = router;
