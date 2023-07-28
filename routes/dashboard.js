/* Import Required Modules */
const express = require("express");
const router = express.Router();
const passport = require("passport");
const fs = require("fs");
const path = require("path");

/* Import Models */
const User = require("../models/User");
const Content = require("../models/Content");
const Event = require("../models/Event");
const Work = require("../models/Work");
const Video = require("../models/Video");

/* Models Map */
const map = {
  User,
  Content,
  Event,
  Work,
  Video,
};

const fetchFormData = () => {
  return (formData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../data/formData.json"), "utf8")
  ));
};

/* Import Auth Configs */
const { forwardAuthenticated } = require("../config/auth");
const { ensureAuthenticated } = require("../config/auth");

/* Dashboard */
router.get("/", ensureAuthenticated, async (req, res) => {
  const list = ["quote", "intro", "news"];
  let docs = [],
    options = {};
  for (let i = 0; i < list.length; i++) {
    const data = await Content.findOne({ name: list[i] });
    docs.push(data);
  }
  options.list = list;
  options.docs = docs;
  const formData = fetchFormData();
  options.formData = formData;
  res.render("admin/dashboard", options);
});

/* Bio */
router.get("/bio", ensureAuthenticated, async (req, res) => {
  let options = {};
  const doc = await Content.findOne({ name: "bio" });
  const formData = fetchFormData();
  options.doc = doc;
  options.formData = formData.bio;
  res.render("admin/bio", options);
});

const docs = [
  { name: "quote" },
  { name: "intro" },
  { name: "news" },
  { name: "bio" },
  { name: "repertoire" },
];

docs.forEach((doc) => {
  router.put("/" + doc.name + "/:id", ensureAuthenticated, async (req, res) => {
    try {
      const updatedDoc = await Content.findByIdAndUpdate(
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
        updatedDoc,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Something went wrong",
      });
    }
  });

  router.get("/" + doc.name + "/:id", ensureAuthenticated, async (req, res) => {
    const doc = await Content.findById(req.params.id);
    res.json({
      success: true,
      doc,
    });
  });
});

/* List Model Routes */
// Options:
// name: String (required) -- name of the route
// model: String (optional) -- name of the model
// content: Array (optional) -- additional content to be displayed on the page
const lists = [
  { name: "events" },
  { name: "videos" },
  { name: "works", content: ["repertoire"] },
];

const Model_Nomenclature = (string) => {
  return (
    string.slice(0, -1).charAt(0).toUpperCase() + string.slice(0, -1).slice(1)
  );
};

lists.forEach((list) => {
  /* Define Variables */
  const { name, model, content } = list;
  const Model = map[Model_Nomenclature(model || name)];

  /* Get Table of Complete Data Page*/
  router.get("/" + name, ensureAuthenticated, async (req, res) => {
    // Initialize variables
    let docs = [],
      options = {};

    if (content) {
      for (let i = 0; i < content.length; i++) {
        const data = await Content.findOne({ name: content[i] });
        docs.push(data);
      }
      options.content = docs;
    }

    const data = await Model.find({});
    options.data = data;

    res.render("admin/" + name, options);
  });

  /* Get Add New Document Page */
  router.get("/" + name + "/new", ensureAuthenticated, (req, res) => {
    // Initialize variables
    let options = {};
    const formData = fetchFormData();
    options.formData = formData[name];

    res.render("admin/operations/new", options);
  });

  /* Post New Document */
  router.post("/" + name, ensureAuthenticated, async (req, res) => {
    try {
      const newDoc = await Model.create({
        body: JSON.stringify(req.body),
      });
      res.json({
        success: true,
        newDoc,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Something went wrong",
      });
    }
  });

  /* Get Edit Document Page */
  router.get(
    "/" + name + "/:id/edit",
    ensureAuthenticated,
    async (req, res) => {
      // Initialize variables
      let options = {};

      const formData = fetchFormData();

      options.doc = await Model.findById(req.params.id);
      options.formData = formData[name];
      res.render("admin/operations/edit", options);
    }
  );

  /* Get Document */
  router.get("/" + name + "/:id", ensureAuthenticated, async (req, res) => {
    const doc = await Model.findById(req.params.id);
    res.json({
      success: true,
      doc,
    });
  });

  /* Put Document */
  router.put("/" + name + "/:id", ensureAuthenticated, async (req, res) => {
    try {
      const updatedDoc = await Model.findByIdAndUpdate(
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
        updatedDoc,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Something went wrong",
      });
    }
  });

  /* Delete Document */
  router.delete("/" + name + "/:id", ensureAuthenticated, async (req, res) => {
    try {
      const deletedDoc = await Model.findByIdAndDelete(req.params.id);
      res.json({
        success: true,
        deletedDoc,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Something went wrong",
      });
    }
  });
});

module.exports = router;
