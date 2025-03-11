const express = require("express");
const { PetController } = require('../controllers');
const { verifyToken } = require("../middlewares/auth");

const PetRouter = express.Router();
PetRouter.get("/get-pet-by-user",verifyToken, PetController.getPetsByUser);
PetRouter.post("/create-pet-by-user",verifyToken, PetController.createPetByUser);


module.exports = PetRouter;