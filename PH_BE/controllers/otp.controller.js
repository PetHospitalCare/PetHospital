const nodemailer = require("nodemailer");
const db = require("../models");
const OTP = db.otp

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "namkhanh2703.work@gmail.com",
        pass: "tuff cyhw bwez qkcm",
    },
});

// send OTP
const sendOTP = async (req, res) => {
    try {
        const { email, type } = req.body;
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await OTP.create({ email, otp, type });
        await transporter.sendMail({
            to: email,
            subject: "Xác thực OTP",
            text: `Mã OTP của bạn là: ${otp}(hiệu lực trong 5 phút)`,
        }).catch(err => console.error("Mail Error:", err));

        res.status(200).json({ message: "OTP sent" });
    } catch (err) {
        console.error("Error in sendOTP:", err);
        res.status(500).json({ error: "Failed to send OTP", details: err.message });
    }
};

// verify OTP
const verifyOTP = async (req, res) => {
    try {
        const { email, otp, type } = req.body;
        const validOTP = await OTP.findOne({ email: email, otp: otp });

        if (!validOTP) {
            return res.status(400).json({ status: 400, error: "Invalid OTP" });
        }

        return res.status(200).json({ status: 200, message: "OTP verified", type: validOTP.type });
    } catch (err) {
        return res.status(500).json({ error: "Verification failed" });
    }
};
module.exports = { verifyOTP, sendOTP };