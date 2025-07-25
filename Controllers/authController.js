const User = require("../models/User");
const otpGenerator = require("../utils/otpGenerator");


//Step-1 Send OTP
const sendOtp = async(req,res) =>{
    const {phoneNumber, phoneSuffix, email} = req.body;
const otp = otpGenerator()
const expiry = new Date(Date.now() + 5 * 60 * 1000)
let user;
try{
if(email){
    user = await User.findOne({email});
    if(!user){
        user = new User({email})
    }
    user.emailOtp = otp;
    user.emailOtpExpiry = expiry
    await user.save()

    return response(res,200, 'OTP send to your email', (email));
}
if(!phoneNumber || !phoneSuffix){
    return response (res, 400, 'Please number and phone suffix are required')
}
const fullPhoneNumber = `${phoneSuffix}${phoneNumber}`;
user = await User.findOne({phoneNumber})
if(!user){
    user = await new User({phoneNumber, phoneSuffix})
}
await user
}
catch(error){

}
}