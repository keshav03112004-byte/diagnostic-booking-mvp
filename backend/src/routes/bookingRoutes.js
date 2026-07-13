const express = require('express');
const bookingController = require('../controllers/bookingController');
const { auth, optionalAuth } = require('../middleware/auth');
const { bookingRules } = require('../validators/authValidators');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/pincode/:pincode', asyncHandler(bookingController.checkPincode));
router.post('/', optionalAuth, bookingRules, asyncHandler(bookingController.createBooking));
router.get('/my', auth, asyncHandler(bookingController.getMyBookings));
router.get('/:id', auth, asyncHandler(bookingController.getBookingById));

module.exports = router;
