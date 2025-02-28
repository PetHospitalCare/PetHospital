const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        account_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Account",
        },


    },
    { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);