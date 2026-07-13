const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    return false;
  }
  return true;
};

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  mobile: user.mobile,
  email: user.email,
  age: user.age,
  gender: user.gender,
  role: user.role,
  addresses: user.addresses,
});

exports.register = async (req, res) => {
  if (!handleValidation(req, res)) return;

  const { name, mobile, email, password, age, gender } = req.body;

  const existing = await User.findOne({ mobile });
  if (existing) {
    return res.status(400).json({ message: 'Mobile number already registered' });
  }

  const user = await User.create({ name, mobile, email, password, age, gender });
  const token = signToken(user._id);

  return res.status(201).json({
    message: 'Registration successful',
    token,
    user: formatUser(user),
  });
};

exports.login = async (req, res) => {
  if (!handleValidation(req, res)) return;

  const { mobile, password } = req.body;
  const user = await User.findOne({ mobile });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid mobile or password' });
  }

  const token = signToken(user._id);
  return res.json({ message: 'Login successful', token, user: formatUser(user) });
};

exports.getProfile = async (req, res) => {
  return res.json({ user: formatUser(req.user) });
};

exports.updateProfile = async (req, res) => {
  const { name, email, age, gender } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, email, age, gender },
    { new: true, runValidators: true }
  ).select('-password');

  return res.json({ message: 'Profile updated', user: formatUser(user) });
};

exports.addAddress = async (req, res) => {
  const { label, line1, city, pincode, landmark, isDefault } = req.body;
  const user = await User.findById(req.user._id);

  if (isDefault) {
    user.addresses.forEach((addr) => {
      addr.isDefault = false;
    });
  }

  user.addresses.push({ label, line1, city, pincode, landmark, isDefault: !!isDefault });
  await user.save();

  return res.status(201).json({ message: 'Address added', user: formatUser(user) });
};
