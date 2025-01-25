
const express = require('express');
const { CategoryController } = require('../controllers');
const categoryRoute = express.Router();

categoryRoute.post("/create", CategoryController.CreateNewCategory);
categoryRoute.get("/get-all", CategoryController.getAllCategory);
categoryRoute.get("/delete:id", CategoryController.deleteCategory);
categoryRoute.get("/test", async (req, res) => {
    return res.json({ message: "hello world" });
});
module.exports = categoryRoute;

