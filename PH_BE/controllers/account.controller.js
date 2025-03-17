const { generateToken, comparePassword } = require("../utils/auth");
const bcrypt = require("bcrypt");
const db = require("../models");
const uploadCloud = require("../middlewares/UploadCloud");
const Account = db.account
const cloudinary = require('cloudinary').v2;

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});
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

    if (!account || !(await comparePassword(password, account.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(account._id, account.role, account.username, account.email);

    res.cookie("access_token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 86400000 //1 ngày 
      // maxAge: 60000 // 1 phút
    });

    res.status(200).json(account);
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
const getAllDoctor = async (req, res) => {
  try {
    const doctor = await Account.find({ role: "doctor" }).select("-password -role");
    if (!doctor) {
      return res.status(404).json({ message: "Không có bác sĩ nào " })
    }

    return res.status(200).json({ message: "Lấy danh sách bác sĩ thành công", doctor });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const getCurrentUser = async (req, res) => {
  try {
      const userId = req.userId; // Lấy userId từ middleware verifyToken

      const user = await Account.findById(userId).select("-password"); // Loại bỏ mật khẩu khi trả về

      if (!user) {
          return res.status(404).json({ success: false, message: "Không tìm thấy người dùng." });
      }

      res.status(200).json({ success: true, account: user });
  } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// Cập nhật thông tin tài khoản 
const updateUserAccount = async (req, res) => {
  try {
    const id = req.userId;
    const { username, phone, gender, address, dateOfBirth } = req.body;

    // Cập nhật thông tin tài khoản
    const updatedAccount = await Account.findByIdAndUpdate(
      id,
      { 
        username, 
        phone, 
        gender, 
        address, 
        dateOfBirth: new Date(dateOfBirth) 
      },
      { new: true, runValidators: true }
    ).select("-password");

    return res.status(200).json({ 
      success: true, 
      message: "Cập nhật thông tin thành công", 
      account: updatedAccount 
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật tài khoản:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// Upload ảnh đại diện
const uploadAvatar = async (req, res) => {
  try {
    const uploadMiddleware = uploadCloud.single('image');

    uploadMiddleware(req, res, async function(err) {

      // Không có file được upload
      if (!req.file) {
        return res.status(400).json({ success: false, message: "Vui lòng chọn file ảnh" });
      }

      const id  = req.userId;
      const user = await Account.findById(id);

      // Nếu người dùng đã có ảnh đại diện, xóa ảnh cũ trên Cloudinary
      if (user.publicId) {
        await cloudinary.uploader.destroy(user.publicId);
      }

      // Lấy thông tin từ file đã upload
      const url = req.file.path;
      const publicId = req.file.filename;
      
      // Cập nhật thông tin ảnh đại diện trong database
      const updatedUser = await Account.findByIdAndUpdate(
        id,
        { 
          url: url, 
          publicId: publicId
        },
        { new: true }
      ).select("-password");

      return res.status(200).json({
        success: true,
        message: "Upload ảnh đại diện thành công",
        url: url,
        publicId: publicId,
        account: updatedUser
      });
    });
  } catch (error) {
    console.error("Lỗi khi upload ảnh đại diện:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
module.exports = { signup, signin, getallAccount, createNewAccount, deleteAccount, editaccount, getAllDoctor, getCurrentUser, updateUserAccount,uploadAvatar };