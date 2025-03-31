const express = require("express");
const { NewController } = require('../controllers');
const { verifyToken } = require("../middlewares/auth");
const uploadCloud = require("../middlewares/UploadCloud");

const NewRouter = express.Router();
NewRouter.get("/get-all", NewController.GetAllNews);
NewRouter.get("/get-one-new/:id", NewController.GetOneNew);
NewRouter.post("/create-new", verifyToken, uploadCloud.single("image"), NewController.CreateNew);
NewRouter.put("/update-new/:id",verifyToken, uploadCloud.single("image"), NewController.EditNew);
NewRouter.delete("/delete-new/:id", NewController.DeleteNew);

module.exports = NewRouter;