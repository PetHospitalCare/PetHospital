const { generateToken, comparePassword } = require("../utils/auth");
const bcrypt = require("bcrypt");
const db = require("../models");
const Account = db.account
// Signup
const signup = async (req, res) => {
  try {
    const { username, password, gender, email, phone, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAccount = new Account({
      username,
      password: hashedPassword,
      gender,
      email,
      phone,
      role
    });
    const savedAccount = await newAccount.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "Email or phone number already exists" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

// Signin
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const account = await Account.findOne({ email });

    // if (!account || !(await comparePassword(password, account.password))) {
    //   return res.status(401).json({ error: "Invalid credentials" });
    // }

    const token = generateToken(account._id, account.role);

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400000
    });

    res.json({ message: "Login successful", role: account.role, token: token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
const getAllAccount = async (req, res) => {
    try {
        const accounts = await Account.find()

        // Trả về danh sách sản phẩm
        return res.status(200).json({
            success: true,
            message: 'Lấy tài khoản thành công',
            accounts,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};
module.exports = { signup, signin, getAllAccount };