/* This JavaScript code snippet is setting up a nodemailer transporter to send emails using a Gmail
account. It first imports the necessary modules `nodemailer` and `dotenv`, and then configures the
transporter with Gmail service and authentication using environment variables for email user and
password. */
const nodemailer = require('nodemailer')
const dotenv  = require('dotenv')
dotenv.config()


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth:{
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }  
})

transporter.verify((error,success) => {
    if(error){
        console.error('Gmail services connection failed')
    }
    else{
        console.log('Gmail configured properly and read to the email')
    }
})

const sendOtpToEmail = async (email, otp) => {
  const html = `
    <div style="background-color: #f4f4f4; padding: 30px 0;">
      <table align="center" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; padding: 40px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; box-shadow: 0 0 10px rgba(0,0,0,0.05); text-align: center;">
              <tr>
                <td>
                  <h2 style="color: #7c4dff; margin-bottom: 20px;">🔐 Viber Account Verification</h2>
                  
                  <p style="font-size: 16px; margin: 0 0 10px;">Hello,</p>
                  
                  <p style="font-size: 16px; margin: 0 0 30px;">
                    Please use the following one-time password (OTP) to verify your Viber account:
                  </p>
                  
                  <div style="font-size: 32px; background: #ede7f6; color: #5e35b1; padding: 15px 30px; border-radius: 8px; font-weight: bold; letter-spacing: 5px; display: inline-block; margin-bottom: 30px;">
                    ${otp}
                  </div>
                  
                  <p style="font-size: 14px; margin-bottom: 20px;"><strong>This OTP is valid for 5 minutes.</strong> Please do not share it with anyone.</p>
                  
                  <p style="font-size: 14px; color: #777;">If you did not request this OTP, simply ignore this message.</p>
                  
                  <p style="margin-top: 40px; font-size: 14px;">Best regards,<br/><strong>Viber Security Team</strong></p>
                  
                  <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;" />
                  
                  <small style="color: #aaa;">This is an automated email. Please do not reply.</small>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;

  await transporter.sendMail({
    from: `Viber Based App <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your Viber Verification Code',
    html
  });
}




module.exports = sendOtpToEmail;