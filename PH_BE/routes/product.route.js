
const express = require('express');
const { ProductController } = require('../controllers');
const uploadCloud = require('../middlewares/UploadCloud');
const productRoute = express.Router();

productRoute.post("/create", uploadCloud.array("imageUrl"), ProductController.CreateNewProduct);
productRoute.get("/test", async (req, res) => {
    return res.json({ message: "hello world" });
});
module.exports = productRoute;

