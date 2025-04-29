const mongoose = require("mongoose");

const SubServiceSchema = new mongoose.Schema({
    name: { type: String, required: false },
    price: {
        dog: { type: Number, required: false },
        cat: { type: Number, required: false }
    }, // Giá theo từng loại thú cưng
    status: { type: String, enum: ["active", "inactive"], default: "active" }, // Trạng thái
}, { _id: true });

const ServiceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    url: { type: String },
    publicId: { type: String },
    subServices: [SubServiceSchema], // Danh sách dịch vụ con
}, { timestamps: true });

const Service = mongoose.model("Service", ServiceSchema);
module.exports = Service;