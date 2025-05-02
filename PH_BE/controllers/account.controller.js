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
    res.status(500).json({ error: "Lỗi server" });
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
      path: "/",
      httpOnly: false,
      secure: true,
      sameSite: "Lax",
      maxAge: 86400000 //1 ngày 
      // maxAge: 60000 // 1 phút
    });

    res.status(200).json(account);
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

// Quên mật khẩu
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const account = await Account.findOne({ email });
    if (!account) return res.status(404).json({ success: false, message: "Email không tồn tại." });
    res.status(200).json({ success: true, account });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

// Reset mật khẩu
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu mới
    const updatedAccount = await Account.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedAccount) {
      return res.status(404).json({ success: false, message: "Không tìm thấy tài khoản." });
    }

    res.status(200).json({ success: true, message: "Đặt lại mật khẩu thành công." });
  } catch (error) {
    console.error("Lỗi khi đặt lại mật khẩu:", error);
    res.status(500).json({ success: false, message: "Lỗi server." });
  }
};

// Đổi mật khẩu
const changePassword = async (req, res) => {
  try {
    const id = req.userId; // Lấy userId từ middleware verifyToken
    const { currentPassword, newPassword } = req.body;

    // Tìm tài khoản theo email
    const account = await Account.findOne({ _id: id });
    if (!account) {
      return res.status(404).json({ success: false, message: "Không tìm thấy tài khoản." });
    }

    // So sánh mật khẩu hiện tại
    const isMatch = await bcrypt.compare(currentPassword, account.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Mật khẩu hiện tại không chính xác." });
    }

    // Hash mật khẩu mới
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu
    account.password = hashedNewPassword;
    await account.save();

    res.status(200).json({ success: true, message: "Đổi mật khẩu thành công." });
  } catch (error) {
    console.error("Lỗi khi đổi mật khẩu:", error);
    res.status(500).json({ success: false, message: "Lỗi server." });
  }
};


// Lấy tất cả tài khoản
const getallAccount = async (req, res) => {
  try {
    // const accounts = await Account.find({ role: { $ne: "customer" } }).sort({ createdAt: -1 });
    const accounts = await Account.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, accounts });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
};


// Tạo tài khoản mới
const createNewAccount = async (req, res) => {
  try {
    const { username, password, email, phone, roles } = req.body;
    const existingAccount = await Account.findOne({
      $or: [
        { email: email },
        { phone: phone }
      ]
    });

    if (existingAccount) {
      return res.status(409).json({
        success: false,
        message: existingAccount.email === email
          ? "Email đã được sử dụng"
          : "Số điện thoại đã được sử dụng"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create new account
    const newAccount = new Account({
      username,
      password: hashedPassword,
      email,
      phone,
      role: roles
    });

    const savedAccount = await newAccount.save();
    res.status(201).json({
      success: true,
      message: "Tạo tài khoản thành công",
      account: {
        _id: savedAccount._id,
        username: savedAccount.username,
        email: savedAccount.email,
        role: savedAccount.role
      }
    });

  } catch (error) {
    console.error("Create account error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo tài khoản"
    });
  }
};

// Xóa tài khoản
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

// Cập nhật tài khoản
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

// Lấy danh sách bác sĩ
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

// Lấy thông tin người dùng hiện tại
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
    const { username, phone, gender, address, dateOfBirth, description } = req.body;

    // Cập nhật thông tin tài khoản
    const updatedAccount = await Account.findByIdAndUpdate(
      id,
      {
        username,
        phone,
        gender,
        address,
        dateOfBirth: new Date(dateOfBirth),
        description
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

    uploadMiddleware(req, res, async function (err) {

      // Không có file được upload
      if (!req.file) {
        return res.status(400).json({ success: false, message: "Vui lòng chọn file ảnh" });
      }

      const id = req.userId;
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
const getAccountbyId = async (req, res) => {
  try {
    const id = req.params.id;
    const account = await Account.findById(id).select("-password");
    return res.status(200).json({
      success: true,
      message: "Lấy thông tin tài khoản thành công",
      account
    });
  } catch (error) {
    console.error("Lỗi khi upload ảnh đại diện:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
module.exports = {
  signup,
  signin,
  forgotPassword,
  resetPassword,
  changePassword,
  getallAccount,
  createNewAccount,
  deleteAccount,
  editaccount,
  getAllDoctor,
  getCurrentUser,
  updateUserAccount,
  uploadAvatar,
  getAccountbyId
};