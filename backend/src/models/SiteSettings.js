const mongoose = require('mongoose');

const statSchema = new mongoose.Schema(
  { value: String, label: String },
  { _id: false }
);

const siteSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: 'main' },
    siteName: { type: String, default: 'DiagBook' },
    badge: { type: String, default: 'Trusted · At-Home · NABL Labs' },
    tagline: { type: String, default: 'Your Health Deserves' },
    taglineHighlight: { type: String, default: 'Care at Your Doorstep' },
    description: {
      type: String,
      default:
        'Book diagnostic tests in 2 minutes. Free home sample collection from NABL-accredited labs. Smart reports delivered within 24 hours.',
    },
    heroVideo: {
      src: {
        type: String,
        default:
          'https://videos.pexels.com/video-files/7578612/7578612-hd_1920_1080_25fps.mp4',
      },
      poster: {
        type: String,
        default:
          'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1920&q=80',
      },
      caption: {
        type: String,
        default: 'Home diagnostic sample collection — book online, get reports in 24 hours',
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
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
