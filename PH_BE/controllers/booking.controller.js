const db = require("../models");
const Booking = db.booking
const CreateNewBooking = async (req, res) => {
    try {
        const {
            account_id,
            pet_id,
            scheduleDate,
            scheduleTime,
            scheduleType,
            type,
            note,
            name,
            phone,
            email,
        } = req.body;

        const newBooking = new Booking({
            account_id,
            pet_id,
            date: scheduleDate,
            hour: scheduleTime,
            service_id: scheduleType,
            type,
            status: "pending",
            note,
            guest_name: name,
            guest_phone: phone,
            guest_email: email,
        });


        await newBooking.save();

        res.status(201).json({ message: "Đặt lịch thành công!", booking: newBooking });
    } catch (error) {
        console.error("Lỗi API create booking:", error);
        res.status(500).json({ message: "Lỗi server!" });
    }
}
module.exports = { CreateNewBooking };