const Disease = require('../models/Disease');
const Test = require('../models/Test');
const Package = require('../models/Package');

exports.getDiseases = async (req, res) => {
  const diseases = await Disease.find({ isActive: true }).sort({ name: 1 });
  return res.json({ diseases });
};

exports.getDiseaseBySlug = async (req, res) => {
  const disease = await Disease.findOne({ slug: req.params.slug, isActive: true });
  if (!disease) return res.status(404).json({ message: 'Category not found' });

  const [tests, packages] = await Promise.all([
    Test.find({ isActive: true, diseaseCategories: disease.slug }),
    Package.find({ isActive: true, diseaseCategories: disease.slug }).populate('tests', 'name price'),
  ]);

  return res.json({ disease, tests, packages });
};
