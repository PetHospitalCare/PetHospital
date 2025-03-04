
const express = require('express');
const { MedicineController } = require('../controllers');
const uploadCloud = require('../middlewares/UploadCloud');
const { verifyToken, authorize } = require('../middlewares/auth');
const medicineRoute = express.Router();

medicineRoute.post("/create", uploadCloud.array("imageUrl"), MedicineController.createNewMedicine);
medicineRoute.get("/get-all", MedicineController.getAllMedicine);
medicineRoute.delete("/delete/:id",  MedicineController.deleteMedicine);
medicineRoute.get("/get-by-id/:id", MedicineController.getOneMedicine);
medicineRoute.put("/edit/:id", uploadCloud.array("imageUrl"), MedicineController.updateMedicine);

module.exports = medicineRoute;

