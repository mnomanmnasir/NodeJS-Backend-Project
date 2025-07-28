const express = require('express');
const  authController = require('../Controllers/authController')
const router = express.Router();

router.post('/send-otp', authController.sendOtp)
router.post('/verfy-otp', authController.verfiyOtp)

module.exports = router;