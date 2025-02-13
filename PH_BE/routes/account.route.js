const express = require("express");
const { signup, signin } = require("../controllers/account.controller");
const { verifyToken, authorize } = require("../middlewares/auth");
const accountRouter = express.Router();

accountRouter.post("/signup", signup);
accountRouter.post("/signin", signin);
accountRouter.get("/profile", verifyToken, (req, res) => {
  res.json({ userId: req.userId, role: req.userRole });
});
accountRouter.get("/admin", verifyToken, authorize("admin"), (req, res) => {
  res.json({ message: "Admin dashboard" });
});

module.exports = accountRouter;