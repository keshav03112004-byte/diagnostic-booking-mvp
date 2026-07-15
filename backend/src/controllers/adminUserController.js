const User = require('../models/User');
const Booking = require('../models/Booking');

exports.getUsers = async (req, res) => {
  const { role, q } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (q?.trim()) {
    const term = q.trim();
    filter.$or = [
      { name: new RegExp(term, 'i') },
      { mobile: new RegExp(term, 'i') },
      { email: new RegExp(term, 'i') },
    ];
  }

  const users = await User.find(filter)
    .select('-password')
    .sort({ createdAt: -1 })
    .limit(200);

  return res.json({ users, count: users.length });
};

exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });

  const bookings = await Booking.find({ user: user._id }).sort({ createdAt: -1 }).limit(50);
  return res.json({ user, bookings });
};

exports.updateUser = async (req, res) => {
  const { name, email, age, gender, role } = req.body;
  const updates = {};

  if (name !== undefined) updates.name = String(name).trim();
  if (email !== undefined) updates.email = String(email).trim().toLowerCase();
  if (age !== undefined) updates.age = age === '' || age == null ? undefined : Number(age);
  if (gender !== undefined) updates.gender = gender;
  if (role !== undefined) {
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    // Prevent demoting the last admin
    if (role === 'user') {
      const target = await User.findById(req.params.id);
      if (target?.role === 'admin') {
        const adminCount = await User.countDocuments({ role: 'admin' });
        if (adminCount <= 1) {
          return res.status(400).json({ message: 'Cannot demote the last admin account' });
        }
      }
    }
    updates.role = role;
  }

  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  }).select('-password');

  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json({ message: 'User updated', user });
};
