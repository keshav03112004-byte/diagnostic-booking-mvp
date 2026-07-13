const { body } = require('express-validator');

exports.registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('mobile').trim().matches(/^[6-9]\d{9}$/).withMessage('Valid 10-digit mobile required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('email').optional().isEmail().withMessage('Valid email required'),
];

exports.loginRules = [
  body('mobile').trim().notEmpty().withMessage('Mobile is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

exports.bookingRules = [
  body('items').isArray({ min: 1 }).withMessage('At least one test or package required'),
  body('items.*.itemType').isIn(['test', 'package']).withMessage('Invalid item type'),
  body('items.*.itemId').notEmpty().withMessage('Item ID required'),
  body('patientName').trim().notEmpty().withMessage('Patient name is required'),
  body('patientMobile').trim().matches(/^[6-9]\d{9}$/).withMessage('Valid mobile required'),
  body('collectionDate').isISO8601().withMessage('Valid collection date required'),
  body('timeSlot').isIn(['morning', 'afternoon', 'evening']).withMessage('Valid time slot required'),
  body('address.line1').trim().notEmpty().withMessage('Address is required'),
  body('address.city').trim().notEmpty().withMessage('City is required'),
  body('address.pincode').trim().matches(/^\d{6}$/).withMessage('Valid 6-digit pincode required'),
];
