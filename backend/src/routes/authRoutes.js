const express = require('express');
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { registerRules, loginRules } = require('../validators/authValidators');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.post('/register', registerRules, asyncHandler(authController.register));
router.post('/login', loginRules, asyncHandler(authController.login));
router.get('/me', auth, asyncHandler(authController.getProfile));
router.put('/me', auth, asyncHandler(authController.updateProfile));
router.post('/addresses', auth, asyncHandler(authController.addAddress));

module.exports = router;
