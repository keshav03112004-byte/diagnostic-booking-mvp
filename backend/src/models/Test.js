const mongoose = require('mongoose');

const testSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    overview: String,
    price: { type: Number, required: true, min: 0 },
    originalPrice: Number,
    sampleType: { type: String, default: 'Blood' },
    fastingRequired: { type: Boolean, default: false },
    fastingHours: { type: Number, default: 0 },
    reportTatHours: { type: Number, default: 24 },
    preparation: String,
    recommendedFor: { type: String, default: 'Everyone' },
    gender: { type: String, default: 'Male & Female' },
    parameters: [{ type: String }],
    whyTakeTest: String,
    whenToTake: String,
    symptoms: [{ type: String }],
    faqs: [{ question: String, answer: String }],
    diseaseCategories: [{ type: String, lowercase: true }],
    isPopular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Test', testSchema);
