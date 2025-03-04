
const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    images: [
        {
            url: { type: String },
            publicId: { type: String },
        },
    ],
    description: {
        type: String
    },
    type: {
        type: String
    },
    pet_type:{
        type: [String],
        enum: ["Dog","Cat"]
    },
    dosage:{
        type: String
    },
    manufacturer:{
        type: String
    },
    unit:{
        type: String
    },
    price: {
        type: Number
    },
    quantity: {
        type: Number
    },
    
    expiry_date:{
        type: Date
    }, 
}, { timestamps: true });

module.exports = mongoose.model('Medicine', medicineSchema);
