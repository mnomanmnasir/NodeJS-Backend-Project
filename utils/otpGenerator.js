/**
 * The function generates a random 5-digit OTP (One Time Password).
 * @returns A function named `otpGenerator` is being returned. This function generates a random 5-digit
 * OTP (One Time Password) and returns it as a string.
 */
const otpGenerator = () => {
    return Math.floor(10000 + Math.random() * 90000).toString()
}

module.exports = otpGenerator;
