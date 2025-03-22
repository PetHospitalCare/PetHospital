const express = require("express");
const { NewController } = require('../controllers');
const { verifyToken } = require("../middlewares/auth");

const NewRouter = express.Router();
NewRouter.get("/get-all", NewController.GetAllNews);
NewRouter.post("/create", NewController.CreateNews);

module.exports = NewRouter;