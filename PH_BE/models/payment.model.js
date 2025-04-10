const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    quantity: { type: Number },
    price: { type: Number },
    imageUrl: { type: String },
    name: { type: String },
});

const addressSchema = new mongoose.Schema({
    selectedAddress: { type: String },
    inputAddress: { type: String },
    province: { type: String },
    district: { type: String },
    ward: { type: String },
});

const paymentSchema = new mongoose.Schema(
    {
        userId: { type: String },
        items: [cartItemSchema],
        totalPrice: { type: Number, default: 0 },
        shipFee: { type: Number, default: 20000 },
        address: addressSchema,
        phone: { type: Number },
        email: { type: String },
        status: { type: Number, default: 0 },
        method: { type: String, default: 'cod' },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
