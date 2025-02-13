
const express = require('express');
const { CategoryController } = require('../controllers');
const { verifyToken, authorize } = require('../middlewares/auth');
const categoryRoute = express.Router();

categoryRoute.post("/create",verifyToken, authorize("admin"), CategoryController.CreateNewCategory);
categoryRoute.get("/get-all", CategoryController.getAllCategory);
categoryRoute.get("/delete:id",verifyToken, authorize("admin"), CategoryController.deleteCategory);
categoryRoute.get("/test", async (req, res) => {
    return res.json({ message: "hello world" });
});
module.exports = categoryRoute;

