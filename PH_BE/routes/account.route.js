const express = require("express");
const { AccountController, OTPController } = require('../controllers');
const { verifyToken, authorize } = require("../middlewares/auth");
const accountRouter = express.Router();

accountRouter.post("/signup", AccountController.signup);
accountRouter.post("/signin", AccountController.signin);
accountRouter.post("/forgot-password", AccountController.forgotPassword);
accountRouter.post("/reset-password", AccountController.resetPassword);
accountRouter.post("/change-password", verifyToken, AccountController.changePassword)
accountRouter.post("/send-otp", OTPController.sendOTP);
accountRouter.post("/verify-otp", OTPController.verifyOTP);
accountRouter.get("/get-all", verifyToken, authorize("admin"), AccountController.getallAccount);
accountRouter.post("/createnewaccount", verifyToken, authorize("admin"), AccountController.createNewAccount);
accountRouter.delete("/delete:id", verifyToken, authorize("staff", "admin"), AccountController.deleteAccount);
accountRouter.put("/edit/:id", AccountController.editaccount);
accountRouter.get("/get-all-doctor", AccountController.getAllDoctor);
accountRouter.get("/current-user", verifyToken, AccountController.getCurrentUser);
accountRouter.put("/update-user-profile", verifyToken, AccountController.updateUserAccount);
accountRouter.post("/upload-avatar", verifyToken, AccountController.uploadAvatar)
accountRouter.get("/get-account-by-id/:id", verifyToken, AccountController.getAccountbyId)
module.exports = accountRouter;