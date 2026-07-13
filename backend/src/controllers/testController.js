const Test = require('../models/Test');

exports.getTests = async (req, res) => {
  const { popular, disease, search, sort } = req.query;
  const filter = { isActive: true };

  if (popular === 'true') filter.isPopular = true;
  if (disease) filter.diseaseCategories = disease.toLowerCase();
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  let sortOption = { name: 1 };
  if (sort === 'price_asc') sortOption = { price: 1 };
  if (sort === 'price_desc') sortOption = { price: -1 };
  if (sort === 'popular') sortOption = { isPopular: -1, name: 1 };

  const tests = await Test.find(filter).sort(sortOption);
  return res.json({ tests, count: tests.length });
};

exports.getTestBySlug = async (req, res) => {
  const test = await Test.findOne({ slug: req.params.slug, isActive: true });
  if (!test) return res.status(404).json({ message: 'Test not found' });
  return res.json({ test });
};

exports.getPopularTests = async (req, res) => {
  const tests = await Test.find({ isActive: true, isPopular: true }).sort({ name: 1 }).limit(12);
  return res.json({ tests });
};
