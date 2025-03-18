mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        dateOfBirth: {
            type: Date
        },
        gender:{
            type: Number,
        },
        weight: {
            type: Number
        },
        type: {
            type: String,
            enum: ["dog", "cat"],
            required: true
        },
        species: {
            type: String,
            required: true
        },
        account_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Account",
        },
        url: { type: String },
        publicId: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Pet", petSchema); 