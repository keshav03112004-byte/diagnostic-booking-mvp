const express = require('express');
const cmsController = require('../controllers/cmsController');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/hero', asyncHandler(cmsController.getHero));

module.exports = router;
