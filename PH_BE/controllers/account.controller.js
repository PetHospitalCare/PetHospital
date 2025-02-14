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
const getallAccount = async (req, res) => {
  try {
    const accounts = await Account.find();
    res.status(200).json({ success: true, accounts });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
const createNewAccount = async (req, res) => {
  try {
    const { username, password, email, phone, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAccount = new Account({
      username,
      password: hashedPassword,
      email,
      phone,
      role
    });
    const savedAccount = await newAccount.save();

    res.status(201).json({ success: true, savedAccount });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "Email or phone number already exists" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};
const deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAccount = await Account.findByIdAndDelete(id);

    if (!deletedAccount) {
      return res.status(404).json({ error: "Tài khoản không tồn tại" });
    }

    res.status(200).json({ message: "Xóa tài khoản thành công" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
const editaccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, phone, role } = req.body;

    const updatedAccount = await Account.findByIdAndUpdate(
      id,
      { username, email, phone, role },
      { new: true, runValidators: true }
    );

    if (!updatedAccount) {
      return res.status(404).json({ message: "Account not found" });
    }

    return res.status(200).json({ message: "Xóa tài khoản thành công", updatedAccount });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { signup, signin, getallAccount, createNewAccount, deleteAccount, editaccount };