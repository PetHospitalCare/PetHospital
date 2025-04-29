const mongoose = require("mongoose");

const MedicalRecordSchema = new mongoose.Schema(
    {

        booking_id: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
        services: [{
            service_id: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
            sub_service_id: { type: mongoose.Schema.Types.ObjectId },
            result: { type: mongoose.Schema.Types.Mixed },
            note: { type: String },
        }],
        generalConclusion: { type: String },
        followUpDate: { type: Date },
        prescription: [
            {
                medicine: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine" },
                quantity: Number,
                instructions: String
            }
        ], // Đơn thuốc
        note: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model("MedicalRecord", MedicalRecordSchema);