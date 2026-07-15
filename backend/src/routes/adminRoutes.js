const express = require('express');
const { auth, requireAdmin } = require('../middleware/auth');
const inquiryController = require('../controllers/inquiryController');
const adminTestController = require('../controllers/adminTestController');
const adminPackageController = require('../controllers/adminPackageController');
const adminBookingController = require('../controllers/adminBookingController');
const adminUserController = require('../controllers/adminUserController');
const adminDiseaseController = require('../controllers/adminDiseaseController');
const adminServiceAreaController = require('../controllers/adminServiceAreaController');
const cmsController = require('../controllers/cmsController');
const { uploadMedia, handleUpload } = require('../middleware/upload');
const asyncHandler = require('../utils/asyncHandler');
const Test = require('../models/Test');
const Package = require('../models/Package');
const Inquiry = require('../models/Inquiry');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Disease = require('../models/Disease');

const router = express.Router();

router.use(auth, requireAdmin);

router.get('/dashboard', asyncHandler(async (_req, res) => {
  const [
    tests,
    packages,
    inquiries,
    bookings,
    newInquiries,
    users,
    diseases,
    bookedToday,
    pendingPayments,
  ] = await Promise.all([
    Test.countDocuments(),
    Package.countDocuments(),
    Inquiry.countDocuments(),
    Booking.countDocuments(),
    Inquiry.countDocuments({ status: 'new' }),
    User.countDocuments({ role: 'user' }),
    Disease.countDocuments(),
    Booking.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    }),
    Booking.countDocuments({ paymentStatus: 'pending' }),
  ]);

  res.json({
    tests,
    packages,
    inquiries,
    bookings,
    newInquiries,
    users,
    diseases,
    bookedToday,
    pendingPayments,
  });
}));

// Inquiries
router.get('/inquiries/stats', asyncHandler(inquiryController.getInquiryStats));
router.get('/inquiries', asyncHandler(inquiryController.getInquiries));
router.get('/inquiries/:id', asyncHandler(inquiryController.getInquiryById));
router.patch('/inquiries/:id', asyncHandler(inquiryController.updateInquiry));
router.delete('/inquiries/:id', asyncHandler(inquiryController.deleteInquiry));

// Bookings
router.get('/bookings', asyncHandler(adminBookingController.getBookings));
router.get('/bookings/:id', asyncHandler(adminBookingController.getBookingById));
router.patch('/bookings/:id', asyncHandler(adminBookingController.updateBooking));
router.delete('/bookings/:id', asyncHandler(adminBookingController.deleteBooking));

// Users
router.get('/users', asyncHandler(adminUserController.getUsers));
router.get('/users/:id', asyncHandler(adminUserController.getUserById));
router.patch('/users/:id', asyncHandler(adminUserController.updateUser));

// Diseases
router.get('/diseases', asyncHandler(adminDiseaseController.getDiseases));
router.post('/diseases', asyncHandler(adminDiseaseController.createDisease));
router.put('/diseases/:id', asyncHandler(adminDiseaseController.updateDisease));
router.delete('/diseases/:id', asyncHandler(adminDiseaseController.deleteDisease));

// Service areas / pincodes
router.get('/service-areas', asyncHandler(adminServiceAreaController.getPincodes));
router.put('/service-areas', asyncHandler(adminServiceAreaController.updatePincodes));

// Tests CRUD
router.get('/tests', asyncHandler(adminTestController.getAllTests));
router.post('/tests', asyncHandler(adminTestController.createTest));
router.put('/tests/:id', asyncHandler(adminTestController.updateTest));
router.delete('/tests/:id', asyncHandler(adminTestController.deleteTest));

// Packages CRUD
router.get('/packages', asyncHandler(adminPackageController.getAllPackages));
router.get('/packages/:id', asyncHandler(adminPackageController.getPackageById));
router.post('/packages', asyncHandler(adminPackageController.createPackage));
router.put('/packages/:id', asyncHandler(adminPackageController.updatePackage));
router.delete('/packages/:id', asyncHandler(adminPackageController.deletePackage));

// CMS
router.get('/cms/settings', asyncHandler(cmsController.getAllSettings));
router.put('/cms/hero', asyncHandler(cmsController.updateHero));
router.post('/cms/upload', uploadMedia, asyncHandler(handleUpload));
router.post('/cms/generate-video', asyncHandler(cmsController.generateVideo));

module.exports = router;
