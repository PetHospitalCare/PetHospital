const db = require("../models");
const MedicalRecord = db.medicalRecord;
const cloudinary = require('cloudinary').v2;
const Booking = db.booking
const Medicine = db.medicine
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
        const { booking_id, services, followUpDate, generalConclusion, result, prescription, note, totalPrice } = medicalData;
        await Booking.findOneAndUpdate({ _id: booking_id }, { status: "complete", price: totalPrice });
        // Trừ số lượng thuốc trong kho
        // Trừ số lượng thuốc trong kho
        if (prescription && prescription.length > 0) {
            for (const item of prescription) {
                const { medicine, quantity } = item;

                // Tìm thuốc trong kho
                const medicineRecord = await Medicine.findById(medicine);
                if (!medicineRecord) {
                    return res.status(404).json({ success: false, message: `Medicine not found: ${medicine}` });
                }

                // Kiểm tra số lượng tồn kho
                if (medicineRecord.quantity < quantity) { // Sửa từ stock thành quantity
                    return res.status(400).json({
                        success: false,
                        message: `Not enough stock for medicine: ${medicineRecord.name}`,
                    });
                }

                // Trừ số lượng
                medicineRecord.quantity -= quantity; // Sửa từ stock thành quantity
                await medicineRecord.save();
            }
        }
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
            followUpDate,
            generalConclusion,
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
        const { booking_id, services, followUpDate, generalConclusion, result, prescription, note, totalPrice } = medicalData;
        await Booking.findOneAndUpdate({ _id: booking_id }, { price: totalPrice });
        const medicalRecord = await MedicalRecord.findOne({ booking_id: id });
        if (!medicalRecord) {
            return res.status(404).json({ error: "Medical record not found" });
        }
        // Trừ số lượng thuốc trong kho
        if (prescription && prescription.length > 0) {
            for (const item of prescription) {
                const { medicine, quantity } = item;

                // Tìm thuốc trong kho
                const medicineRecord = await Medicine.findById(medicine);
                if (!medicineRecord) {
                    return res.status(404).json({ success: false, message: `Medicine not found: ${medicine}` });
                }

                // Kiểm tra số lượng tồn kho
                if (medicineRecord.quantity < quantity) { // Sửa từ stock thành quantity
                    return res.status(400).json({
                        success: false,
                        message: `Not enough stock for medicine: ${medicineRecord.name}`,
                    });
                }

                // Trừ số lượng
                medicineRecord.quantity -= quantity; // Sửa từ stock thành quantity
                await medicineRecord.save();
            }
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
        medicalRecord.generalConclusion = generalConclusion;
        medicalRecord.result = result;
        medicalRecord.prescription = prescription.map(item => ({
            medicine: item.medicine, // This is the medicine ObjectId
            quantity: Number(item.quantity),
            instructions: item.instructions || ""
        }));
        medicalRecord.followUpDate = followUpDate;
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
                { path: 'pet_id' },
                { path: 'doctor_id' }
            ]
        }).select(`booking_id _id createdAt updatedAt services note `);
        res.status(200).json({ success: true, data: medicalRecords });
    } catch (err) {
        console.error("Error in getAllMedicalRecords:", err);
    }
}

const getOneMedicalByUser = async (req, res) => {
    try {
        const { id } = req.params;

        let medicalRecords = await MedicalRecord.findOne({ booking_id: id })
            .populate({
                path: 'booking_id',
                populate: [
                    { path: 'doctor_id' },
                    {
                        path: 'pet_id',
                        populate: { path: 'account_id' }
                    }
                ]
            })
            .populate({
                path: 'services.service_id',
            })
            .populate("prescription.medicine")
            .select(`booking_id _id createdAt updatedAt services note prescription generalConclusion followUpDate`);

        // **Lọc subServices**
        if (medicalRecords) {
            medicalRecords = medicalRecords.toObject(); // Convert to plain object
            medicalRecords.services = medicalRecords.services.map(service => {
                const filteredSubServices = service.service_id?.subServices.filter(sub =>
                    service.sub_service_id?.equals(sub._id)
                );
                return {
                    ...service,
                    service_id: {
                        ...service.service_id,
                        subServices: filteredSubServices, // Chỉ giữ subServices đã chọn
                    }
                };
            });
        }

        res.status(200).json({ success: true, data: medicalRecords });
    } catch (err) {
        console.error("Error in getOneMedicalByUser:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
module.exports = { getMedicalbyBookingId, createMedicalRecord, updateMedicalRecord, getAllMedicalRecords, getOneMedicalByUser };