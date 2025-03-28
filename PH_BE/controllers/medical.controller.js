const db = require("../models");
const MedicalRecord = db.medicalRecord;
const cloudinary = require('cloudinary').v2;
const Booking = db.booking
// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});
const getMedicalbyBookingId = async (req, res) => {
    try {
        const { id } = req.params;
        const medical = await MedicalRecord.findOne({ booking_id: id }).populate("services.service_id").populate("prescription.medicine");;
        res.status(200).json({ success: true, data: medical });
    } catch (err) {
        console.error("Error in getMedicalbyBookingId:", err);
        res.status(500).json({ error: "Failed to get medical record", details: err.message });
    }
};

const createMedicalRecord = async (req, res) => {
    try {
        const medicalData = JSON.parse(req.body.medicalRecord);
        const { booking_id, services, diagnosis, result, prescription, note, symptom, totalPrice } = medicalData;
        await Booking.findOneAndUpdate({ _id: booking_id }, { status: "complete", price: totalPrice });
        // Handle uploaded files
        const files = req.files;
        const fileServices = Array.isArray(req.body.fileServices)
            ? req.body.fileServices
            : [req.body.fileServices];

        // Map files to services
        const servicesWithFiles = services.map(service => {
            if (files && fileServices.includes(service.sub_service_id)) {
                const uploadedFiles = files.filter(
                    file => fileServices[fileServices.indexOf(service.sub_service_id)] === service.sub_service_id
                );

                const result = {
                    ...service.result
                };

                // Handle Excel file
                const excelFile = uploadedFiles.find(f => f.mimetype.includes('spreadsheet') || f.mimetype.includes('excel'));
                if (excelFile) {
                    result.fileUrl = excelFile.path;
                    result.fileName = excelFile.originalname;
                    result.fileType = excelFile.mimetype;
                }

                // Handle images
                const images = uploadedFiles.filter(f => f.mimetype.startsWith('image/'));
                if (images.length > 0) {
                    result.images = images.map(image => ({
                        url: image.path,
                        publicId: image.filename,
                        name: image.originalname
                    }));
                }

                return {
                    ...service,
                    result
                };
            }
            return service;
        });

        const medicalRecord = new MedicalRecord({
            booking_id,
            services: servicesWithFiles,
            diagnosis,
            symptom,
            result,
            prescription,
            note,
        });

        await medicalRecord.save();
        res.status(201).json({ success: true, data: medicalRecord });

    } catch (err) {
        console.error("Error in createMedicalRecord:", err);
        res.status(500).json({ error: "Failed to create medical record", details: err.message });
    }
};

const updateMedicalRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const medicalData = JSON.parse(req.body.medicalRecord);
        const { booking_id, services, diagnosis, result, prescription, note, symptom, totalPrice } = medicalData;
        await Booking.findOneAndUpdate({ _id: booking_id }, { price: totalPrice });
        const medicalRecord = await MedicalRecord.findOne({ booking_id: id });
        if (!medicalRecord) {
            return res.status(404).json({ error: "Medical record not found" });
        }

        // Handle uploaded files
        const files = req.files;
        const fileServices = Array.isArray(req.body.fileServices)
            ? req.body.fileServices
            : [req.body.fileServices];

        // Map files to services and handle old file deletion
        const servicesWithFiles = await Promise.all(services.map(async service => {
            if (files && fileServices.includes(service.sub_service_id)) {
                const uploadedFiles = files.filter(
                    file => fileServices[fileServices.indexOf(service.sub_service_id)] === service.sub_service_id
                );

                const result = {
                    ...service.result
                };

                // Handle Excel file
                const excelFile = uploadedFiles.find(f => f.mimetype.includes('spreadsheet') || f.mimetype.includes('excel'));
                if (excelFile) {
                    // Delete old Excel file if exists
                    if (service.result?.fileUrl) {
                        const publicId = service.result.fileUrl.split('/upload/')[1]
                            .split('/')
                            .slice(1)
                            .join('/')
                            .split('.')[0];
                        await cloudinary.uploader.destroy(publicId).catch(() => { });
                    }

                    result.fileUrl = excelFile.path;
                    result.fileName = excelFile.originalname;
                    result.fileType = excelFile.mimetype;
                }

                // Handle images
                const images = uploadedFiles.filter(f => f.mimetype.startsWith('image/'));
                if (images.length > 0) {
                    // Keep existing images and add new ones
                    const existingImages = service.result?.images || [];

                    // Add new images to the array
                    const newImages = images.map(image => ({
                        url: image.path,
                        publicId: image.filename,
                        name: image.originalname
                    }));

                    // Combine existing and new images
                    result.images = [...existingImages, ...newImages];
                }

                return {
                    ...service,
                    result
                };
            }
            return service;
        }));

        medicalRecord.services = servicesWithFiles;
        medicalRecord.diagnosis = diagnosis;
        medicalRecord.result = result;
        medicalRecord.prescription = prescription.map(item => ({
            medicine: item.medicine, // This is the medicine ObjectId
            quantity: Number(item.quantity),
            instructions: item.instructions || ""
        }));
        medicalRecord.symptom = symptom;
        medicalRecord.note = note;

        await medicalRecord.save();
        res.status(200).json({ success: true, data: medicalRecord });
    } catch (err) {
        console.error("Error in updateMedicalRecord:", err);
        res.status(500).json({ error: "Failed to update medical record", details: err.message });
    }
};
const getAllMedicalRecords = async (req, res) => {
    try {
        const medicalRecords = await MedicalRecord.find().populate({
            path: 'booking_id',
            populate: [

                { path: 'doctor_id' }
            ]
        }).select(`booking_id _id createdAt updatedAt services note `);
        res.status(200).json({ success: true, data: medicalRecords });
    } catch (err) {
        console.error("Error in getAllMedicalRecords:", err);
    }
}

module.exports = { getMedicalbyBookingId, createMedicalRecord, updateMedicalRecord, getAllMedicalRecords };