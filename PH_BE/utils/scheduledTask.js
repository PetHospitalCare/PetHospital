const cron = require('node-cron');
const db = require('../models');
Booking = db.booking;
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "namkhanh2703.work@gmail.com",
        pass: "tuff cyhw bwez qkcm",
    },
});
// Hàm cập nhật các booking quá hạn
const updateExpiredBookings = async () => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set về đầu ngày

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
const SendMailTakeMedical = async () => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find bookings hnay
        const todayBookings = await db.booking.find({
            date: {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            },
            status: 'confirm'
        }).populate('pet_id').populate('doctor_id');
        console.log(todayBookings)
        // Send emails for each booking
        for (const booking of todayBookings) {
            const mailOptions = {
                from: "namkhanh2703.work@gmail.com",
                to: booking.guest_email,
                subject: 'Nhắc nhở lịch khám thú cưng tại Pet Hospital',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2563eb;">Xin chào ${booking.guest_name}!</h2>
                        <p>Chúng tôi xin nhắc nhở bạn về lịch khám cho thú cưng <strong>${booking?.pet_id?.name ? booking.pet_id.name : `${booking?.type}`}</strong> hôm nay:</p>
                        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
                            <p><strong>⏰ Thời gian:</strong> ${booking.hour}</p>
                            <p><strong>👨‍⚕️ Bác sĩ:</strong> ${booking.doctor_id.username}</p>
                        </div>
                        <p>Vui lòng đến đúng giờ để được phục vụ tốt nhất.</p>
                        <p style="color: #dc2626;"><em>Lưu ý: Nếu bạn cần thay đổi lịch, vui lòng liên hệ với chúng tôi sớm nhất có thể.</em></p>
                        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0;">Trân trọng,</p>
                            <p style="margin: 5px 0; color: #2563eb; font-weight: bold;">Pet Hospital</p>
                        </div>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log(`✅ Đã gửi email nhắc nhở cho ${booking.guest_email}`);
        }

        console.log(`📧 Đã gửi tổng cộng ${todayBookings.length} email nhắc nhở lịch khám`);
    } catch (error) {
        console.error('❌ Lỗi khi gửi email nhắc nhở:', error);
    }
};


const initScheduledTasks = () => {
    // Existing expired bookings task
    cron.schedule('1 0 * * *', () => {
        console.log('Đang chạy task cập nhật booking quá hạn...');
        updateExpiredBookings();
    });

    // Add new email reminder task - runs at 7:00 AM daily
    cron.schedule('0 7 * * *', () => {
        console.log('Đang gửi email nhắc nhở lịch khám...');
        SendMailTakeMedical();
    });

    // Run initial tasks
    SendMailTakeMedical();
    updateExpiredBookings();
};

module.exports = { initScheduledTasks };