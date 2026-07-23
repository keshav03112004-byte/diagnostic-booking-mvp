const Package = require('../models/Package');

exports.getPackages = async (req, res) => {
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

  let sortOption = { sortOrder: 1, name: 1 };
  if (sort === 'price_asc') sortOption = { price: 1 };
  if (sort === 'price_desc') sortOption = { price: -1 };
  if (sort === 'popular') sortOption = { isPopular: -1, sortOrder: 1, name: 1 };

  const packages = await Package.find(filter).populate('tests', 'name slug price').sort(sortOption);
  return res.json({ packages, count: packages.length });
};

exports.getPackageBySlug = async (req, res) => {
  const pkg = await Package.findOne({ slug: req.params.slug, isActive: true }).populate(
    'tests',
    'name slug price sampleType fastingRequired reportTatHours description overview parameters'
  );
  if (!pkg) return res.status(404).json({ message: 'Package not found' });
  return res.json({ package: pkg });
};

exports.getPopularPackages = async (req, res) => {
  const packages = await Package.find({ isActive: true, isPopular: true })
    .populate('tests', 'name')
    .sort({ sortOrder: 1, name: 1 })
    .limit(8);
  return res.json({ packages });
};
