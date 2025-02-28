const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
    {
        account_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Account",
        },
        full_name: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        pets:[
            {
                pet_name: String
            }
        ],
        customer_id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        phone_number: {
            type: String,
            required: true
        },
        pet_id: {
            type: String,
            required: true
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);