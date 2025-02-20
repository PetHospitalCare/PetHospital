
const express = require('express');
const { ProductController } = require('../controllers');
const uploadCloud = require('../middlewares/UploadCloud');
const { verifyToken, authorize } = require('../middlewares/auth');
const petRoute = express.Router();

petRoute.post("/create", verifyToken, authorize("admin"), uploadCloud.array("imageUrl"), ProductController.CreateNewProduct);
petRoute.get("/get-all", ProductController.getAllProduct);
petRoute.delete("/delete:id", verifyToken, authorize("staff", "admin"), ProductController.deleteProduct);

module.exports = productRoute;

