require('dotenv').config();
const User = require('../models/User');
const SiteSettings = require('../models/SiteSettings');

const seedAdminAndCms = async () => {
  const adminMobile = process.env.ADMIN_MOBILE || '9999999999';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  const existingAdmin = await User.findOne({ role: 'admin' });
  if (!existingAdmin) {
    await User.create({
      name: 'Admin',
      mobile: adminMobile,
      email: 'admin@diagbook.in',
      password: adminPassword,
      role: 'admin',
    });
    console.log(`Admin user created — mobile: ${adminMobile}, password: ${adminPassword}`);
  }

  const settings = await SiteSettings.findOne({ key: 'main' });
  if (!settings) {
    await SiteSettings.create({ key: 'main' });
    console.log('Default site settings (CMS) created');
  }
};

module.exports = seedAdminAndCms;
