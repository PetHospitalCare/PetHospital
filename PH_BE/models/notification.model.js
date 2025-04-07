const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["message", "booking"],
    },
    content: {
        type: String,
    },
    isRead: {
        type: Boolean,
        default: false
    },
    expiresAt: {
        type: Date,
        default: Date.now,
        expires: 172800
    }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);