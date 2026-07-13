const express = require('express');
const { auth, requireAdmin } = require('../middleware/auth');
const inquiryController = require('../controllers/inquiryController');
const adminTestController = require('../controllers/adminTestController');
const adminPackageController = require('../controllers/adminPackageController');
const cmsController = require('../controllers/cmsController');
const { uploadMedia, handleUpload } = require('../middleware/upload');
const asyncHandler = require('../utils/asyncHandler');
const Test = require('../models/Test');
const Package = require('../models/Package');
const Inquiry = require('../models/Inquiry');
const Booking = require('../models/Booking');

const router = express.Router();

router.use(auth, requireAdmin);

router.get('/dashboard', asyncHandler(async (_req, res) => {
  const [tests, packages, inquiries, bookings, newInquiries] = await Promise.all([
    Test.countDocuments(),
    Package.countDocuments(),
    Inquiry.countDocuments(),
    Booking.countDocuments(),
    Inquiry.countDocuments({ status: 'new' }),
  ]);
  res.json({ tests, packages, inquiries, bookings, newInquiries });
}));

// Inquiries
router.get('/inquiries/stats', asyncHandler(inquiryController.getInquiryStats));
router.get('/inquiries', asyncHandler(inquiryController.getInquiries));
router.get('/inquiries/:id', asyncHandler(inquiryController.getInquiryById));
router.patch('/inquiries/:id', asyncHandler(inquiryController.updateInquiry));
router.delete('/inquiries/:id', asyncHandler(inquiryController.deleteInquiry));

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

module.exports = router;
