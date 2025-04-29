const nodemailer = require("nodemailer");
const db = require("../models");
const OTP = db.otp;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "namkhanh2703.work@gmail.com",
    pass: "tuff cyhw bwez qkcm",
  },
});

const generateOTPEmailTemplate = (otp) => {
    return `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #4285f4;">
          <h1 style="color: #4285f4; margin: 0; font-size: 24px;"> 🔐Xác nhận đăng ký tài khoản</h1>
        </div>
        
        <div style="padding: 20px 0;">
          <p style="color: #333; font-size: 16px; margin-bottom: 25px;">Chào bạn,</p>
          
          <h3 style="color: #333; margin-bottom: 15px; font-size: 16px;">Mã OTP của bạn là:</h3>
          
          <div style="background: #f0f5ff; padding: 20px; text-align: center; margin: 20px 0; border-radius: 6px; border-left: 4px solid #4285f4;">
            <span style="font-size: 30px; font-weight: bold; letter-spacing: 6px; color: #333;">${otp}</span>
          </div>
          
          <p style="color: #333; font-size: 14px; margin-top: 20px; background-color: #fff8e1; padding: 12px; border-radius: 6px; border-left: 4px solid #ffa000;">
            <strong>⚠️ Vui lòng không chia sẻ OTP với bất kỳ ai.</strong>
          </p>

          <p style="color: #555; font-size: 14px; margin-bottom: 5px;">Mã này sẽ hết hạn sau <span style="font-weight: bold; color: #e03e2d;">5 phút</span>.</p>
          
        </div>
  
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
          <p style="color: #666; font-size: 14px;">Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
          <p style="color: #666; font-size: 14px;">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi 😊</p>
        </div>
      </div>
    `;
  };

// This function sends an OTP to the user's email address
const sendOTP = async (req, res) => {
  try {
    const { email, type } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.create({ email, otp, type });
    
    const mailOptions = {
      from: '"Pet Hospital" <namkhanh2703.work@gmail.com>',
      to: email,
      subject: "Xác thực OTP",
      html: generateOTPEmailTemplate(otp),
    };

    await transporter.sendMail(mailOptions)
      .catch(err => console.error("Lỗi gửi mail:", err));

    res.status(200).json({ message: "OTP đã được gửi" });
  } catch (err) {
    console.error("Lỗi khi gửi mã otp:", err);
    res.status(500).json({ error: "Thất bại khi gửi mã otp", details: err.message });
  }
};

// This function verifies the OTP entered by the user 
const verifyOTP = async (req, res) => {
  try {
    const { email, otp, type } = req.body;
    const validOTP = await OTP.findOne({ email: email, otp: otp });

    if (!validOTP) {
      return res.status(400).json({ status: 400, error: "Mã otp không hợp lệ" });
    }

    return res.status(200).json({ status: 200, message: "Mã otp hợp lệ", type: validOTP.type });
  } catch (err) {
    return res.status(500).json({ error: "Xác thực otp thất bại" });
  }
};

module.exports = { verifyOTP, sendOTP };