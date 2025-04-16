const cron = require('node-cron');
const db = require('../models');
Booking = db.booking;

// Hàm cập nhật các booking quá hạn
const updateExpiredBookings = async () => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set về đầu ngày

        // Sử dụng db.booking thay vì import Booking trực tiếp
        const result = await db.booking.updateMany(
            {
                date: { $lt: today },
                status: { $nin: ['complete', 'cancel'] }
            },
            {
                $set: { status: 'cancel' }
            }
        );

        console.log(`${result.modifiedCount} booking đã được cập nhật thành 'cancel'`);
    } catch (error) {
        console.error('Lỗi khi cập nhật booking quá hạn:', error);
    }
};

// Chạy task mỗi ngày vào lúc 00:01
const initScheduledTasks = () => {
    // Chạy vào 00:01 mỗi ngày (phút 1 của giờ 0)
    cron.schedule('1 0 * * *', () => {
        console.log('Đang chạy task cập nhật booking quá hạn...');
        updateExpiredBookings();
    });

    // Chạy ngay khi khởi động server để cập nhật các booking đã quá hạn
    updateExpiredBookings();
};

module.exports = { initScheduledTasks };