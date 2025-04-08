const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true,
    },
    staffParticipants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    }],
    status: {
        type: String,
        enum: ['active', 'resolved'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    unread: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });

// Tự động tạo conversation khi khách hàng mới đăng ký
conversationSchema.index({ customerId: 1 }, { unique: true });

module.exports = mongoose.model('Conversation', conversationSchema);