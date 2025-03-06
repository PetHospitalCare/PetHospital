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
        type: {
            type: String,
            enum: ["dog", "cat"],
            required: true
        },
        species: {
            type: String,
            required: true
        },
        profile_id: {
            type: String
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