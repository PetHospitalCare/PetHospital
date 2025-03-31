const express = require("express");
const { PetController } = require('../controllers');
const { verifyToken } = require("../middlewares/auth");

const PetRouter = express.Router();
PetRouter.get("/get-pet-by-user",verifyToken, PetController.getPetsByUser);
PetRouter.post("/create-pet-by-user",verifyToken, PetController.createPetByUser);
PetRouter.put("/update-pet-info/:id",verifyToken, PetController.updatedPet);
PetRouter.post("/upload-pet-avatar/:id",verifyToken, PetController.uploadPetAvatar);
PetRouter.delete("/delete-pet-by-user/:id",verifyToken, PetController.deletePetByUser);

module.exports = PetRouter;