const Test = require('../models/Test');
const { slugify } = require('../utils/slugify');

const buildUniqueSlug = async (name, excludeId = null) => {
  let base = slugify(name) || 'test';
  let slug = base;
  let counter = 1;

  while (true) {
    const filter = { slug };
    if (excludeId) filter._id = { $ne: excludeId };
    const exists = await Test.findOne(filter);
    if (!exists) return slug;
    slug = `${base}-${counter}`;
    counter += 1;
  }
};

exports.getAllTests = async (req, res) => {
  const tests = await Test.find().sort({ createdAt: -1 });
  return res.json({ tests, count: tests.length });
};

exports.createTest = async (req, res) => {
  const {
    name,
    description,
    price,
    originalPrice,
    sampleType,
    fastingRequired,
    fastingHours,
    reportTatHours,
    preparation,
    recommendedFor,
    gender,
    parameters,
    diseaseCategories,
    isPopular,
    isActive,
    overview,
    whyTakeTest,
    whenToTake,
  } = req.body;

  if (!name?.trim() || !description?.trim() || price == null) {
    return res.status(400).json({ message: 'Name, description, and price are required' });
  }

  const slug = await buildUniqueSlug(name);

  const test = await Test.create({
    name: name.trim(),
    slug,
    description: description.trim(),
    overview: overview?.trim() || description.trim(),
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : undefined,
    sampleType: sampleType || 'Blood',
    fastingRequired: !!fastingRequired,
    fastingHours: fastingHours || 0,
    reportTatHours: reportTatHours || 24,
    preparation,
    recommendedFor: recommendedFor || 'Everyone',
    gender: gender || 'Male & Female',
    parameters: parameters || [],
    diseaseCategories: diseaseCategories || [],
    isPopular: !!isPopular,
    isActive: isActive !== false,
    whyTakeTest,
    whenToTake,
  });

  return res.status(201).json({ message: 'Test created', test });
};

exports.updateTest = async (req, res) => {
  const test = await Test.findById(req.params.id);
  if (!test) return res.status(404).json({ message: 'Test not found' });

  const updates = { ...req.body };
  if (updates.name && updates.name !== test.name) {
    updates.slug = await buildUniqueSlug(updates.name, test._id);
  }
  if (updates.price != null) updates.price = Number(updates.price);
  if (updates.originalPrice != null) updates.originalPrice = Number(updates.originalPrice);

  const updated = await Test.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  return res.json({ message: 'Test updated', test: updated });
};

exports.deleteTest = async (req, res) => {
  const test = await Test.findByIdAndDelete(req.params.id);
  if (!test) return res.status(404).json({ message: 'Test not found' });
  return res.json({ message: 'Test deleted' });
};
