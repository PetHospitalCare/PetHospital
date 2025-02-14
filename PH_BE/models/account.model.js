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
        gender:{
            type: String,
            enum: ["male", "female"],
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: [true, "Account email is duplicate"],
            match: [/^[a-zA-Z0-9._%+-]+@gmail\.com$/, "Email must be a valid Gmail address"]
        },
        phone: {
            type: String,
            required: true,
            unique: [true, "phone is duplicate"],
        },
        role: {
            type: [String],
            enum: ["customer", "doctor", "admin", "staff"],
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Account", accountSchema);