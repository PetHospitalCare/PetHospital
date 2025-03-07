const db = require("../models");
const Booking = db.booking
const server = require("../server");
const CreateNewBooking = async (req, res) => {
    try {
        const {
            account_id,
            pet_id,
            scheduleDate,
            scheduleTime,
            scheduleType,
            subServiceId,
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
            sub_service_id: subServiceId,
            guest_name: name,
            guest_phone: phone,
            guest_email: email,
        });


        await newBooking.save();
        server.io.emit("newBooking", newBooking);
        res.status(201).json({ message: "Đặt lịch thành công!", booking: newBooking });
    } catch (error) {
        console.error("Lỗi API create booking:", error);
        res.status(500).json({ message: "Lỗi server!" });
    }
}
const GetAllBooking = async (req, res) => {
    try {
        const bookings = await Booking.find();
        return res.status(200).json(bookings);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi khi lấy danh sách booking", error });
    }
}
module.exports = { CreateNewBooking, GetAllBooking };