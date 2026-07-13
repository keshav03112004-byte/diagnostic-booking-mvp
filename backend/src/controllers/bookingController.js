const Booking = require('../models/Booking');
const Test = require('../models/Test');
const Package = require('../models/Package');
const { validationResult } = require('express-validator');
const { generateOrderId, isPincodeServiceable } = require('../utils/helpers');

const resolveItems = async (items) => {
  const resolved = [];
  let total = 0;

  for (const item of items) {
    if (item.itemType === 'test') {
      const test = await Test.findById(item.itemId);
      if (!test || !test.isActive) throw new Error(`Test not found: ${item.itemId}`);
      resolved.push({
        itemType: 'test',
        itemId: test._id,
        itemModel: 'Test',
        name: test.name,
        price: test.price,
      });
      total += test.price;
    } else if (item.itemType === 'package') {
      const pkg = await Package.findById(item.itemId);
      if (!pkg || !pkg.isActive) throw new Error(`Package not found: ${item.itemId}`);
      resolved.push({
        itemType: 'package',
        itemId: pkg._id,
        itemModel: 'Package',
        name: pkg.name,
        price: pkg.price,
      });
      total += pkg.price;
    } else {
      throw new Error('Invalid item type');
    }
  }

  return { resolved, total };
};

exports.createBooking = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  const {
    items,
    patientName,
    patientMobile,
    patientEmail,
    patientAge,
    patientGender,
    collectionDate,
    timeSlot,
    address,
    notes,
    paymentMethod = 'cod',
    isQuickBook = false,
  } = req.body;

  if (!isPincodeServiceable(address.pincode)) {
    return res.status(400).json({
      message: 'Sorry, home collection is not available for this pincode yet.',
    });
  }

  try {
    const { resolved, total } = await resolveItems(items);

    const booking = await Booking.create({
      user: req.user?._id,
      orderId: generateOrderId(),
      patientName,
      patientMobile,
      patientEmail,
      patientAge,
      patientGender,
      items: resolved,
      totalAmount: total,
      collectionDate,
      timeSlot,
      address,
      notes,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      isQuickBook,
    });

    return res.status(201).json({
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
  return res.json({ bookings });
};

exports.getBookingById = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });

  if (booking.user && booking.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Access denied' });
  }

  return res.json({ booking });
};

exports.checkPincode = async (req, res) => {
  const { pincode } = req.params;
  const serviceable = isPincodeServiceable(pincode);
  return res.json({
    pincode,
    serviceable,
    message: serviceable
      ? 'Home collection available in your area'
      : 'Home collection not available for this pincode yet',
  });
};
