/* Import Required Modules */
const express = require("express");
const router = express.Router();
const xml = require("xml");

/* Import Models */
const Event = require("../models/Event");

// Generate sitemap
const getUrls = async () => {
  const staticUrls = [
    {
      loc: "https://will-hopkins.com",
      lastmod: new Date(),
      changefreq: "monthly",
      priority: 0.9,
    },
    {
      loc: "https://will-hopkins.com/events",
      lastmod: new Date(),
      changefreq: "monthly",
      priority: 0.7,
    },
    {
      loc: "https://will-hopkins.com/bio",
      lastmod: new Date(),
      changefreq: "monthly",
      priority: 0.7,
    },
    {
      loc: "https://will-hopkins.com/listen",
      lastmod: new Date(),
      changefreq: "monthly",
      priority: 0.7,
    },
    {
      loc: "https://will-hopkins.com/contact",
      lastmod: new Date(),
      changefreq: "monthly",
      priority: 0.7,
    },
    // Add as many URLs as you need
  ];

  const eventDocuments = await Event.find({});
  const eventUrls = eventDocuments.map((doc) => {
    const sitemap = JSON.parse(doc.body).sitemap;
    return {
      ...sitemap,
      lastmod: new Date(sitemap.lastmod),
    };
  });
  return [...staticUrls, ...eventUrls];
};

router.get("/sitemap.xml", async (req, res) => {
  const urls = await getUrls();
  const sitemap = [
    { _attr: { xmlns: "https://www.sitemaps.org/schemas/sitemap/0.9" } },
    ...urls.map((url) => ({
      url: [
        { loc: url.loc },
        { lastmod: url.lastmod.toISOString().split("T")[0] },
        { changefreq: url.changefreq },
        { priority: url.priority },
      ],
    })),
  ];

  res.header("Content-Type", "application/xml");
  res.send(xml({ urlset: sitemap }, { declaration: true }));
});

module.exports = router;
