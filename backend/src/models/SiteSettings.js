const mongoose = require('mongoose');

const statSchema = new mongoose.Schema(
  { value: String, label: String },
  { _id: false }
);

const siteSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: 'main' },
    siteName: { type: String, default: 'energex.life' },
    badge: { type: String, default: 'Accredited • At-Home Collection • Expert Analysis' },
    tagline: { type: String, default: 'Advanced Diagnostics at' },
    taglineHighlight: { type: String, default: 'Your Fingertips' },
    description: {
      type: String,
      default:
        'Book diagnostic tests and full body scans from the comfort of your home. Certified samples. Advanced labs. Smart reports in 24 hours.',
    },
    heroVideo: {
      src: {
        type: String,
        default: '/videos/hero-health.mp4',
      },
      poster: {
        type: String,
        default:
          'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1920&q=80',
      },
      caption: {
        type: String,
        default: 'Clinical diagnostic laboratory analysis — book online, get reports in 24 hours',
      },
    },
    heroStats: {
      type: [statSchema],
      default: [
        { value: '13+', label: 'Lab Tests' },
        { value: '5', label: 'Health Packages' },
        { value: '24h', label: 'Report Delivery' },
        { value: '60min', label: 'Home Collection' },
      ],
    },
    heroTags: {
      type: [String],
      default: ['Blood Tests', 'Full Body Checkup', 'Home Collection', 'Free Counselling'],
    },
    serviceablePincodes: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
