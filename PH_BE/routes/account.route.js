const express = require("express");
const { AccountController, OTPController } = require('../controllers');
const { verifyToken, authorize } = require("../middlewares/auth");
const accountRouter = express.Router();

accountRouter.post("/signup", AccountController.signup);
accountRouter.post("/signin", AccountController.signin);
accountRouter.post("/send-otp", OTPController.sendOTP);
accountRouter.post("/verify-otp", OTPController.verifyOTP);
accountRouter.get("/get-all", AccountController.getAllAccount)
accountRouter.get("/profile", verifyToken, (req, res) => {
  res.json({ userId: req.userId, role: req.userRole });
});
accountRouter.get("/admin", verifyToken, authorize("admin"), (req, res) => {
  res.json({ message: "Admin dashboard" });
});
accountRouter.get("/get-all", getallAccount);
accountRouter.post("/createnewaccount", createNewAccount);
accountRouter.delete("/delete:id", deleteAccount);
accountRouter.put("/edit/:id", editaccount);
module.exports = accountRouter;