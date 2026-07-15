const Booking = require('../models/Booking');

exports.getBookings = async (req, res) => {
  const { status, paymentStatus, q } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (paymentStatus) filter.paymentStatus = paymentStatus;
  if (q?.trim()) {
    const term = q.trim();
    filter.$or = [
      { orderId: new RegExp(term, 'i') },
      { patientName: new RegExp(term, 'i') },
      { patientMobile: new RegExp(term, 'i') },
      { 'address.pincode': new RegExp(term, 'i') },
    ];
  }

  const bookings = await Booking.find(filter)
    .populate('user', 'name mobile email')
    .sort({ createdAt: -1 })
    .limit(200);

  return res.json({ bookings, count: bookings.length });
};

exports.getBookingById = async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('user', 'name mobile email');
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  return res.json({ booking });
};

exports.updateBooking = async (req, res) => {
  const { status, paymentStatus, notes } = req.body;
  const allowedStatus = ['booked', 'sample_collected', 'processing', 'report_ready', 'cancelled'];
  const allowedPayment = ['pending', 'paid', 'failed', 'refunded'];

  const updates = {};
  if (status) {
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: 'Invalid booking status' });
    }
    updates.status = status;
  }
  if (paymentStatus) {
    if (!allowedPayment.includes(paymentStatus)) {
      return res.status(400).json({ message: 'Invalid payment status' });
    }
    updates.paymentStatus = paymentStatus;
  }
  if (notes !== undefined) updates.notes = String(notes);

  const booking = await Booking.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  }).populate('user', 'name mobile email');

  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  return res.json({ message: 'Booking updated', booking });
};

exports.deleteBooking = async (req, res) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  return res.json({ message: 'Booking deleted' });
};
