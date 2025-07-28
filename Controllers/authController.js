/* This code snippet is a JavaScript function named `sendOtp` that is responsible for sending OTP
(One-Time Password) to either an email address or a phone number. Here is a breakdown of what the
code is doing: */
const User = require("../models/User");
const sendOtpToEmail = require("../services/emailService");
const otpGenerator = require("../utils/otpGenerator");
const response = require('../utils/responseHandler')
const generateToken = require('../utils/generateToken')
//Step-1 Send OTP
/**
 * The function `sendOtp` is an asynchronous function that generates and sends an OTP (One Time
 * Password) to either an email address or a phone number based on the provided request data.
 * @param req - The `req` parameter typically represents the request object in Node.js applications. It
 * contains information about the HTTP request that triggered the function, including headers,
 * parameters, body, and more. In this context, `req.body` is likely an object containing data sent in
 * the request body.
 * @param res - The `res` parameter in the `sendOtp` function is typically the response object in an
 * Express route handler. It is used to send a response back to the client making the request.
 * @returns The `sendOtp` function returns different responses based on the conditions:
 */
const sendOtp = async (req, res) => {
    const { phoneNumber, phoneSuffix, email } = req.body;
    const otp = otpGenerator()
    const expiry = new Date(Date.now() + 5 * 60 * 1000)
    let user;
    try {
        if (email) {
            user = await User.findOne({ email });
            if (!user) {
                user = new User({ email })
            }
            user.emailOtp = otp;
            user.emailOtpExpiry = expiry
            await user.save()
            await sendOtpToEmail(email, otp)
            return response(res, 200, 'OTP send to your email', (email));
        }
        if (!phoneNumber || !phoneSuffix) {
            return response(res, 400, 'Please number and phone suffix are required')
        }
        const fullPhoneNumber = `${phoneSuffix}${phoneNumber}`;
        user = await User.findOne({ phoneNumber })
        if (!user) {
            user = await new User({ phoneNumber, phoneSuffix })
        }
        await user.save();

        return response(res, 200, 'Otp send successfully', user)
    }
    catch (error) {
        console.error(error)
        return response(res, 500, 'Internal Server Error',)
    }
}

/**
 * The function `verifyOtp` is used to verify a user's OTP (One Time Password) sent to their email for
 * authentication.
 * @param req - The `req` parameter typically represents the request object in Node.js applications. It
 * contains information about the HTTP request that triggered the function, including headers,
 * parameters, body, and more. In this specific function `verifyOtp`, `req` is expected to contain the
 * `email` and `otp
 * @param res - The `res` parameter in the `verifyOtp` function is typically used to send a response
 * back to the client making the request. It is an object that represents the HTTP response that the
 * server sends back to the client. In this function, the `res` parameter is used to send different
 * @returns The function `verifyOtp` is returning a response with status code and message using the
 * `response` function. If the user is not found, it returns a 404 status with the message 'User not
 * found'. If the OTP is invalid or expired, it returns a 400 status with the message 'Invalid or
 * expiry otp'. If there are no errors, it updates the user's verification status
 */
const verfiyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        let user;
        if (email) {
            user = await User.findOne({ email });
            if (!user) {
                return response(res, 404, 'User not found')
            }
            const now = new Date();
            if (!user.emailOtp || String(user.emailOtp) !== String(otp) || now > new Date(user.emailOtpExpiry)) {
                return response(res, 400, 'Invalid or expiry otp')
            };
            user.isVerified = true;
            user.emailOtp = null;
            user.emailOtpExpiry = null;
            await user.save()
        }

        const token = generateToken(user?._id)

        res.cookie('auth_token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365
        });
        return response(res, 200, 'Otp verified successfully', { token, user })
    }
    catch (error) {
        console.error(error)
        return response(res, 500, 'Internal Server Error',)
    }
}


module.exports = {
    sendOtp,verfiyOtp
}