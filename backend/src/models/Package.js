const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    overview: String,
    price: { type: Number, required: true, min: 0 },
    originalPrice: Number,
    tests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Test' }],
    testCategories: [{ name: String, tests: [String] }],
    benefits: [{ type: String }],
    highlights: [{ type: String }],
    fastingRequired: { type: Boolean, default: false },
    fastingHours: { type: Number, default: 0 },
    reportTatHours: { type: Number, default: 24 },
    preparation: String,
    recommendedFor: { type: String, default: 'Everyone' },
    gender: { type: String, default: 'Male & Female' },
    totalTestsCount: Number,
    includedTestNames: [{ type: String }],
    faqs: [{ question: String, answer: String }],
    diseaseCategories: [{ type: String, lowercase: true }],
    isPopular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 100 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Package', packageSchema);
