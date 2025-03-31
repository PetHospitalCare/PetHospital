
const express = require('express');
const { MedicalController } = require('../controllers');
const { verifyToken, authorize } = require('../middlewares/auth');
const uploadCloud = require('../middlewares/UploadCloud');
const MedicalRoute = express.Router();
// Add error handling middleware for file uploads
const handleUpload = (req, res, next) => {
    uploadCloud.array('files')(req, res, (err) => {
        if (err) {
            console.error('Upload Error:', err);
            return res.status(400).json({
                error: 'File upload error',
                details: err.message
            });
        }
        next();
    });
};
MedicalRoute.get("/get-by-booking/:id", MedicalController.getMedicalbyBookingId);
MedicalRoute.post("/create", handleUpload, MedicalController.createMedicalRecord);
MedicalRoute.put("/update/:id", uploadCloud.array('files'), MedicalController.updateMedicalRecord);
MedicalRoute.get("/get-all", MedicalController.getAllMedicalRecords);
MedicalRoute.get("/get-by-user/:id", MedicalController.getOneMedicalByUser);
module.exports = MedicalRoute;

