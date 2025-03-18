const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    quantity: { type: Number },
    price: { type: Number },
    imageUrl: { type: String },
    name: { type: String },
});

const paymentSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        items: [cartItemSchema],
        totalPrice: { type: Number, default: 0 },
        shipFee: { type: Number, default: 20000 },
        address: { type: String }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
