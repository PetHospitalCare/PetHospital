const db = require("../models");
const MedicalRecord = db.medicalRecord;

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
        const { booking_id, services, diagnosis, result, prescription, note } = req.body;

        const medicalRecord = new MedicalRecord({
            booking_id,
            services,
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
        const { services, diagnosis, result, prescription, note } = req.body;

        const medicalRecord = await MedicalRecord.findOne({ booking_id: id });
        if (!medicalRecord) {
            return res.status(404).json({ error: "Medical record not found" });
        }

        medicalRecord.services = services;
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