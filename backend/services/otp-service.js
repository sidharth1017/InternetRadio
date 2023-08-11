const crypto = require("crypto");
const hashService = require("./hash-service");
const nodemailer = require("nodemailer");

const smsSid = process.env.SMS_SID;
const smsAuthToken = process.env.SMS_AUTH_TOKEN;
const twilio = require("twilio")(smsSid, smsAuthToken, {
  lazyLoading: true,
});

class OtpService {
  async generateOtp() {
    const otp = crypto.randomInt(1000, 9999);
    return otp;
  }

  async sendBySms(phone, otp) {
    return await twilio.messages.create({
      to: phone,
      from: process.env.SMS_FROM_NUMBER,
      body: `Your JKLU Radio OTP is ${otp}`,
    });
  }

  async sendByMail(email, otp) {
    try {
      let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL, 
          pass: process.env.PASSWORD, 
        },
      });

      const mailOptions = {
        from: process.env.EMAIL, 
        to: email,
        subject: "JKLU Radio OTP", 
        text: `Your JKLU Radio OTP is ${otp}`, 
      };

      let info = await transporter.sendMail(mailOptions);
      return true; 
    } catch (error) {
      console.error("Error sending email: ", error);
      return false;
    }
  }

  verifyOtp(hashedOtp, data) {
    let computedHash = hashService.hashOtp(data);
    return computedHash === hashedOtp;
  }
}

module.exports = new OtpService();
