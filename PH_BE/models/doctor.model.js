const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
    {
        account_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Account",
        },
        full_name: {
            type: String,
            required: true
        },
        specialization: {
            type: String,
            required: true
        },
        experience:{
            type: Number,
            required: true
        },
        license_number:{
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);