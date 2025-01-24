
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
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
    price: {
        type: Number
    },
    quantity: {
        type: Number
    },
    categoryId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    }],
    type: {
        type: String,
        enum: ["Dog", "Cat"],
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
