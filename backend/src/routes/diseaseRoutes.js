const express = require('express');
const diseaseController = require('../controllers/diseaseController');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(diseaseController.getDiseases));
router.get('/:slug', asyncHandler(diseaseController.getDiseaseBySlug));

module.exports = router;
