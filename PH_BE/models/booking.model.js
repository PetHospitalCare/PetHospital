const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        account_id: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
        pet_id: { type: mongoose.Schema.Types.ObjectId, ref: "Pet" },
        date: { type: Date },
        hour: { type: String },
        service_id: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
        sub_service_id: { type: mongoose.Schema.Types.ObjectId, ref: "SubService" },
        type: { enum: ["dog", "cat"], type: String },
        status: { enum: ["pending", "confirm", "cancel", "complete"], type: String },
        note: { type: String },
        guest_name: { type: String, default: null },
        guest_phone: { type: String, default: null },
        guest_email: { type: String, default: null },
        doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
        price: { type: Number },
        payment: {
            order_code: {
                type: Number,
                unique: true,
            },
            status: { type: Boolean, default: false },
            method: {
                type: String,
                enum: ["cash", "transfer"],
            },
            qrcode: {
                type: String
            },
            date: { type: Date }
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);