const Disease = require('../models/Disease');
const { slugify } = require('../utils/slugify');

const buildUniqueSlug = async (name, excludeId = null) => {
  let base = slugify(name) || 'disease';
  let slug = base;
  let counter = 1;

  while (true) {
    const filter = { slug };
    if (excludeId) filter._id = { $ne: excludeId };
    const exists = await Disease.findOne(filter);
    if (!exists) return slug;
    slug = `${base}-${counter}`;
    counter += 1;
  }
};

exports.getDiseases = async (_req, res) => {
  const diseases = await Disease.find().sort({ name: 1 });
  return res.json({ diseases, count: diseases.length });
};

exports.createDisease = async (req, res) => {
  const { name, description, icon, isActive } = req.body;
  if (!name?.trim() || !description?.trim()) {
    return res.status(400).json({ message: 'Name and description are required' });
  }

  const slug = await buildUniqueSlug(name);
  const disease = await Disease.create({
    name: name.trim(),
    slug,
    description: description.trim(),
    icon: icon?.trim() || '🩺',
    isActive: isActive !== false,
  });

  return res.status(201).json({ message: 'Disease created', disease });
};

exports.updateDisease = async (req, res) => {
  const { name, description, icon, isActive } = req.body;
  const disease = await Disease.findById(req.params.id);
  if (!disease) return res.status(404).json({ message: 'Disease not found' });

  if (name?.trim() && name.trim() !== disease.name) {
    disease.name = name.trim();
    disease.slug = await buildUniqueSlug(name, disease._id);
  }
  if (description !== undefined) disease.description = String(description).trim();
  if (icon !== undefined) disease.icon = String(icon).trim() || '🩺';
  if (isActive !== undefined) disease.isActive = !!isActive;

  await disease.save();
  return res.json({ message: 'Disease updated', disease });
};

exports.deleteDisease = async (req, res) => {
  const disease = await Disease.findByIdAndDelete(req.params.id);
  if (!disease) return res.status(404).json({ message: 'Disease not found' });
  return res.json({ message: 'Disease deleted' });
};
