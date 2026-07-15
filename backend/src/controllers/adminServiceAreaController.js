const SiteSettings = require('../models/SiteSettings');
const { DEFAULT_SERVICEABLE_PINCODES, setServiceablePincodes } = require('../utils/helpers');

const getOrCreateSettings = async () => {
  let settings = await SiteSettings.findOne({ key: 'main' });
  if (!settings) {
    settings = await SiteSettings.create({
      key: 'main',
      serviceablePincodes: DEFAULT_SERVICEABLE_PINCODES,
    });
  }
  if (!settings.serviceablePincodes?.length) {
    settings.serviceablePincodes = DEFAULT_SERVICEABLE_PINCODES;
    await settings.save();
  }
  return settings;
};

exports.getPincodes = async (_req, res) => {
  const settings = await getOrCreateSettings();
  const pincodes = settings.serviceablePincodes || [];
  return res.json({ pincodes, count: pincodes.length });
};

exports.updatePincodes = async (req, res) => {
  const { pincodes } = req.body;
  if (!Array.isArray(pincodes)) {
    return res.status(400).json({ message: 'pincodes must be an array of strings' });
  }

  const cleaned = [
    ...new Set(
      pincodes
        .map((p) => String(p).trim())
        .filter((p) => /^\d{6}$/.test(p))
    ),
  ].sort();

  const settings = await getOrCreateSettings();
  settings.serviceablePincodes = cleaned;
  await settings.save();
  setServiceablePincodes(cleaned);

  return res.json({
    message: 'Serviceable pincodes updated',
    pincodes: cleaned,
    count: cleaned.length,
  });
};

exports.refreshPincodeCache = async () => {
  const settings = await SiteSettings.findOne({ key: 'main' });
  const list = settings?.serviceablePincodes?.length
    ? settings.serviceablePincodes
    : DEFAULT_SERVICEABLE_PINCODES;
  setServiceablePincodes(list);
  return list;
};
