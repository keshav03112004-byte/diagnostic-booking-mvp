const Package = require('../models/Package');
const Test = require('../models/Test');
const { slugify } = require('../utils/slugify');

const buildUniqueSlug = async (name, excludeId = null) => {
  let base = slugify(name) || 'package';
  let slug = base;
  let counter = 1;

  while (true) {
    const filter = { slug };
    if (excludeId) filter._id = { $ne: excludeId };
    const exists = await Package.findOne(filter);
    if (!exists) return slug;
    slug = `${base}-${counter}`;
    counter += 1;
  }
};

const resolveTests = async (testIds = []) => {
  if (!testIds.length) return { tests: [], includedTestNames: [], totalTestsCount: 0 };
  const tests = await Test.find({ _id: { $in: testIds } });
  return {
    tests: tests.map((t) => t._id),
    includedTestNames: tests.map((t) => t.name),
    totalTestsCount: tests.length,
  };
};

exports.getAllPackages = async (req, res) => {
  const packages = await Package.find()
    .populate('tests', 'name slug price')
    .sort({ createdAt: -1 });
  return res.json({ packages, count: packages.length });
};

exports.getPackageById = async (req, res) => {
  const pkg = await Package.findById(req.params.id).populate('tests', 'name slug price');
  if (!pkg) return res.status(404).json({ message: 'Package not found' });
  return res.json({ package: pkg });
};

exports.createPackage = async (req, res) => {
  const {
    name,
    description,
    overview,
    price,
    originalPrice,
    testIds,
    benefits,
    highlights,
    fastingRequired,
    fastingHours,
    reportTatHours,
    preparation,
    recommendedFor,
    gender,
    diseaseCategories,
    isPopular,
    isActive,
  } = req.body;

  if (!name?.trim() || !description?.trim() || price == null) {
    return res.status(400).json({ message: 'Name, description, and price are required' });
  }

  const slug = await buildUniqueSlug(name);
  const testData = await resolveTests(testIds || []);

  const pkg = await Package.create({
    name: name.trim(),
    slug,
    description: description.trim(),
    overview: overview?.trim() || description.trim(),
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : undefined,
    tests: testData.tests,
    includedTestNames: testData.includedTestNames,
    totalTestsCount: testData.totalTestsCount,
    benefits: benefits || [],
    highlights: highlights || [],
    fastingRequired: !!fastingRequired,
    fastingHours: fastingHours || 0,
    reportTatHours: reportTatHours || 24,
    preparation,
    recommendedFor: recommendedFor || 'Everyone',
    gender: gender || 'Male & Female',
    diseaseCategories: diseaseCategories || [],
    isPopular: !!isPopular,
    isActive: isActive !== false,
  });

  const populated = await Package.findById(pkg._id).populate('tests', 'name slug price');
  return res.status(201).json({ message: 'Package created', package: populated });
};

exports.updatePackage = async (req, res) => {
  const pkg = await Package.findById(req.params.id);
  if (!pkg) return res.status(404).json({ message: 'Package not found' });

  const updates = { ...req.body };
  delete updates.testIds;

  if (updates.name && updates.name !== pkg.name) {
    updates.slug = await buildUniqueSlug(updates.name, pkg._id);
  }
  if (updates.price != null) updates.price = Number(updates.price);
  if (updates.originalPrice != null) updates.originalPrice = Number(updates.originalPrice);

  if (req.body.testIds) {
    const testData = await resolveTests(req.body.testIds);
    updates.tests = testData.tests;
    updates.includedTestNames = testData.includedTestNames;
    updates.totalTestsCount = testData.totalTestsCount;
  }

  const updated = await Package.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  }).populate('tests', 'name slug price');

  return res.json({ message: 'Package updated', package: updated });
};

exports.deletePackage = async (req, res) => {
  const pkg = await Package.findByIdAndDelete(req.params.id);
  if (!pkg) return res.status(404).json({ message: 'Package not found' });
  return res.json({ message: 'Package deleted' });
};
