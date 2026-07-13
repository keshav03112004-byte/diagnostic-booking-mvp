const mongoose = require('mongoose');

const bookingItemSchema = new mongoose.Schema({
  itemType: { type: String, enum: ['test', 'package'], required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'items.itemModel' },
  itemModel: { type: String, enum: ['Test', 'Package'], required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    orderId: { type: String, required: true, unique: true },
    patientName: { type: String, required: true },
    patientMobile: { type: String, required: true },
    patientEmail: String,
    patientAge: Number,
    patientGender: String,
    items: [bookingItemSchema],
    totalAmount: { type: Number, required: true },
    collectionDate: { type: Date, required: true },
    timeSlot: { type: String, enum: ['morning', 'afternoon', 'evening'], required: true },
    address: {
      line1: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, required: true },
      landmark: String,
    },
    notes: String,
    status: {
      type: String,
      enum: ['booked', 'sample_collected', 'processing', 'report_ready', 'cancelled'],
      default: 'booked',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: { type: String, default: 'cod' },
    isQuickBook: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
