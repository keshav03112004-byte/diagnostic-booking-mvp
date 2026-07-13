const express = require('express');
const testController = require('../controllers/testController');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/popular', asyncHandler(testController.getPopularTests));
router.get('/', asyncHandler(testController.getTests));
router.get('/:slug', asyncHandler(testController.getTestBySlug));

module.exports = router;
