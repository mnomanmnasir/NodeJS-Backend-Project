/* This code snippet is defining a Mongoose schema for a user in a Node.js application using the
Mongoose library. Here's a breakdown of what each part of the code is doing: */
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    /* This code snippet is defining a field called `phoneNumber` in a Mongoose schema. Here's what each
    property is doing: */
    phoneNumber: {
        type: String,
        unique: true,
        sparse: true //Check the value for not null but unique number
    },
    phoneSuffix: { //Check the country code using phoneSuffix
        type: String,
        unique: false
    },
    username: {
        type: String
    },
    email: {
        type: String,
        lowercase: true,
        // validate: { validator: function (v) { return /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(v); }, message: props => `${props.value} is not a valid email address!` }
        validate: {
            validator: function (v) {
                return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    emailOtp: {
        type: String
    },
    emailOtpExpiry: { type: Date },
    profilePicture: { type: String },
    about: { type: String },
    lastSeen: { type: Date },
    isOnline: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    agreed: { type: Boolean, default: false }


}, { timeStamps: true })


const User = mongoose.model("User", userSchema);
module.exports = User;