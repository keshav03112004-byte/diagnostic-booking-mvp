const express = require('express');
const inquiryController = require('../controllers/inquiryController');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.post('/', asyncHandler(inquiryController.createInquiry));

module.exports = router;
