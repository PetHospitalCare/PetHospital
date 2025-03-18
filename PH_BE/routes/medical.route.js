
const express = require('express');
const { MedicalController } = require('../controllers');
const { verifyToken, authorize } = require('../middlewares/auth');
const MedicalRoute = express.Router();

MedicalRoute.get("/get-by-booking/:id", MedicalController.getMedicalbyBookingId);
MedicalRoute.post("/create", MedicalController.createMedicalRecord);
MedicalRoute.put("/update/:id", MedicalController.updateMedicalRecord);
module.exports = MedicalRoute;

