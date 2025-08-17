const express = require('express');
const  authController = require('../Controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { multerMiddleware } = require('../Config/cloudinaryConfig');
const router = express.Router();

router.post('/send-otp', authController.sendOtp)
router.post('/verfy-otp', authController.verfiyOtp)
router.get('/logout', authController.logout)


// protected route

router.put('/update-profile',authMiddleware,multerMiddleware,authController.updateProfile)
router.get('/check-auth',authMiddleware,authController.chechAuthenticate)
router.get('/users',authMiddleware,authController.getAllUsers)


module.exports = router;