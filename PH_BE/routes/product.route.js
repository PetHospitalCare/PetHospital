
const express = require('express');
const { ProductController } = require('../controllers');
const uploadCloud = require('../middlewares/UploadCloud');
const { verifyToken, authorize } = require('../middlewares/auth');
const productRoute = express.Router();

productRoute.post("/create", verifyToken, authorize("admin"), uploadCloud.array("imageUrl"), ProductController.CreateNewProduct);
productRoute.get("/get-all", ProductController.getAllProduct);
productRoute.delete("/delete:id", verifyToken, authorize("staff", "admin"), ProductController.deleteProduct);
productRoute.get("/getById:id", ProductController.getProductById);

module.exports = productRoute;

