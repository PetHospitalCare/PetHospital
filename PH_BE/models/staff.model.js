const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
    {
        account_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Account",
        },
        full_name: {
            type: String,
            required: true
        },
        shift: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Staff", staffSchema);