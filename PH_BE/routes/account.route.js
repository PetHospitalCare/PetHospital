const express = require("express");
const { AccountController ,OTPController } = require('../controllers');
const { verifyToken, authorize } = require("../middlewares/auth");
const accountRouter = express.Router();

accountRouter.post("/signup", AccountController.signup);
accountRouter.post("/signin", AccountController.signin);
accountRouter.post("/send-otp", OTPController.sendOTP);
accountRouter.post("/verify-otp", OTPController.verifyOTP);
accountRouter.get("/get-all",AccountController.getAllAccount)
accountRouter.get("/profile", verifyToken, (req, res) => {
  res.json({ userId: req.userId, role: req.userRole });
});
accountRouter.get("/admin", verifyToken, authorize("admin"), (req, res) => {
  res.json({ message: "Admin dashboard" });
});

module.exports = accountRouter;