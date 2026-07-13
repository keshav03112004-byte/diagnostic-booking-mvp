const SiteSettings = require('../models/SiteSettings');

const getOrCreateSettings = async () => {
  let settings = await SiteSettings.findOne({ key: 'main' });
  if (!settings) {
    settings = await SiteSettings.create({ key: 'main' });
  }
  return settings;
};

exports.getHero = async (_req, res) => {
  const settings = await getOrCreateSettings();
  return res.json({
    siteName: settings.siteName,
    badge: settings.badge,
    tagline: settings.tagline,
    taglineHighlight: settings.taglineHighlight,
    description: settings.description,
    heroVideo: settings.heroVideo,
    heroStats: settings.heroStats,
    heroTags: settings.heroTags,
  });
};

exports.updateHero = async (req, res) => {
  const settings = await getOrCreateSettings();
  const fields = [
    'siteName',
    'badge',
    'tagline',
    'taglineHighlight',
    'description',
    'heroVideo',
    'heroStats',
    'heroTags',
  ];

  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      settings[field] = req.body[field];
    }
  });

  await settings.save();
  return res.json({ message: 'Hero content updated', settings });
};

exports.getAllSettings = async (_req, res) => {
  const settings = await getOrCreateSettings();
  return res.json({ settings });
};
