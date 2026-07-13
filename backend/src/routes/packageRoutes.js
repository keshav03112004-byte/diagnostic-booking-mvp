const express = require('express');
const packageController = require('../controllers/packageController');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/popular', asyncHandler(packageController.getPopularPackages));
router.get('/', asyncHandler(packageController.getPackages));
router.get('/:slug', asyncHandler(packageController.getPackageBySlug));

module.exports = router;
