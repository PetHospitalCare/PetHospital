const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        url: { type: String },
        publicId: { type: String },
        password: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            enum: ["male", "female"],
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        address: {
            type: String,
        },
        role: {
            type: [String],
            enum: ["customer", "doctor", "admin", "staff"],
            required: true
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Account", accountSchema);