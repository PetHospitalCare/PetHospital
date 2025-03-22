const db = require("../models");
const MedicalRecord = db.medicalRecord;
const cloudinary = require('cloudinary').v2;

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});
const getMedicalbyBookingId = async (req, res) => {
    try {
        const { id } = req.params;
        const medical = await MedicalRecord.findOne({ booking_id: id }).populate("services.service_id");
        res.status(200).json({ success: true, data: medical });
    } catch (err) {
        console.error("Error in getMedicalbyBookingId:", err);
        res.status(500).json({ error: "Failed to get medical record", details: err.message });
    }
};

const createMedicalRecord = async (req, res) => {
    try {
        //Parse medical record data from JSON string

        const medicalData = JSON.parse(req.body.medicalRecord);
        const { booking_id, services, diagnosis, result, prescription, note } = medicalData;

        //Handle uploaded files
        const files = req.files;
        const fileServices = Array.isArray(req.body.fileServices)
            ? req.body.fileServices
            : [req.body.fileServices];

        // Map files to services
        const servicesWithFiles = services.map(service => {
            if (files && fileServices.includes(service.sub_service_id)) {
                const file = files[fileServices.indexOf(service.sub_service_id)];
                return {
                    ...service,
                    result: {
                        ...service.result,
                        fileUrl: file.path, // Cloudinary URL
                        fileName: file.originalname,
                        fileType: file.mimetype
                    }
                };
            }
            return service;
        });

        const medicalRecord = new MedicalRecord({
            booking_id,
            services: servicesWithFiles,
            diagnosis,
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
        const { services, diagnosis, result, prescription, note } = medicalData;

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
                const file = files[fileServices.indexOf(service.sub_service_id)];

                // Delete old file from Cloudinary if exists
                if (service.result?.fileUrl) {
                    const publicId = service.result.fileUrl.split('/upload/')[1] // Lấy phần sau "/upload/"
                        .split('/') // Tách thành mảng dựa trên dấu "/"
                        .slice(1) // Bỏ phần "v1742222290" (version)
                        .join('/') // Nối lại thành đường dẫn
                        .split('.')[0]; // Bỏ phần mở rộng file
                    await cloudinary.uploader.destroy(publicId).catch(() => { });
                }

                return {
                    ...service,
                    result: {
                        ...service.result,
                        fileUrl: file.path,
                        fileName: file.originalname,
                        fileType: file.mimetype
                    }
                };
            }
            return service;
        }));

        medicalRecord.services = servicesWithFiles;
        medicalRecord.diagnosis = diagnosis;
        medicalRecord.result = result;
        medicalRecord.prescription = prescription;
        medicalRecord.note = note;

        await medicalRecord.save();
        res.status(200).json({ success: true, data: medicalRecord });
    } catch (err) {
        console.error("Error in updateMedicalRecord:", err);
        res.status(500).json({ error: "Failed to update medical record", details: err.message });
    }
};

module.exports = { getMedicalbyBookingId, createMedicalRecord, updateMedicalRecord };