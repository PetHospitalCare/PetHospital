
const express = require('express');
const { ProductController } = require('../controllers');
const uploadCloud = require('../middlewares/UploadCloud');
const productRoute = express.Router();

productRoute.post("/create", uploadCloud.array("imageUrl"), ProductController.CreateNewProduct);
productRoute.get("/get-all", ProductController.getAllProduct);
productRoute.delete("/delete:id", ProductController.deleteProduct);
productRoute.get("/test", async (req, res) => {
    return res.json({ message: "hello world" });
});
module.exports = productRoute;

