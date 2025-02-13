const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
    {
        account_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Account",
        },
        full_name: {
            type: String,
            required: true
        },
        
    },
    { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);