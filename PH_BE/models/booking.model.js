const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        account_id: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
        pet_id: { type: mongoose.Schema.Types.ObjectId, ref: "Pet" },
        date: { type: Date },
        hour: { type: String },
        service_id: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
        type: { enum: ["dog", "cat"], type: String },
        status: { enum: ["pending", "done", "cancel"], type: String },
        note: { type: String },
        guest_name: { type: String, default: null },
        guest_phone: { type: String, default: null },
        guest_email: { type: String, default: null },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);