const express = require("express");
const { signup, signin, getallAccount, createNewAccount, deleteAccount, editaccount } = require("../controllers/account.controller");
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
accountRouter.get("/get-all", getallAccount);
accountRouter.post("/createnewaccount", createNewAccount);
accountRouter.delete("/delete:id", deleteAccount);
accountRouter.put("/edit/:id", editaccount);
module.exports = accountRouter;