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

        const newBookingData = {
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
        };

        // Chỉ thêm account_id và pet_id nếu account_id không rỗng
        if (account_id) {
            newBookingData.account_id = account_id;
            newBookingData.pet_id = pet_id;
        }

        const newBooking = new Booking(newBookingData);
        await newBooking.save();

        server.io.emit("newBooking", newBooking);
        res.status(201).json({ message: "Đặt lịch thành công!", booking: newBooking });
    } catch (error) {
        console.error("Lỗi API create booking:", error);
        res.status(500).json({ message: "Lỗi server!" });
    }
};

const GetAllBooking = async (req, res) => {
    try {
        const bookings = await Booking.find().populate("doctor_id").populate("pet_id")
        return res.status(200).json(bookings);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi khi lấy danh sách booking", error });
    }
}
const AssignDoctor = async (req, res) => {
    try {
        const { doctor_id } = req.body
        const booking_id = req.params.id;
        await Booking.findByIdAndUpdate(booking_id, { doctor_id: doctor_id, status: "confirm" });
        return res.status(200).json({ message: "Cập nhật bác sĩ thành công!" });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi khi lấy danh sách booking", error });
    }
}
const UpdateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, hour, service_id, sub_service_id, note } = req.body;
        const booking = await Booking.findByIdAndUpdate(
            id,
            { date, hour, service_id, sub_service_id, note },
            { new: true }
        );
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        res.status(200).json({ success: true, booking });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi khi lấy danh sách booking", error });
    }
};

const getBookingByUser = async (req, res) =>{
    try{
        const userId = req.userId;

        const userBooking = await Booking.find({account_id: userId}).populate("doctor_id").populate("pet_id").populate("service_id")
        if (!userBooking) {
            return res.status(404).json({ success: false, message: "Không tìm thấy thông tin đặt lịch khám của người dùng" });
        }

        res.status(200).json({success: true, booking: userBooking});
  
    }    
    catch(error){
        return res.status(500).json({ message: "Lỗi khi lấy danh sách booking", error });
    }
};

module.exports = { CreateNewBooking, GetAllBooking, AssignDoctor, UpdateBooking, getBookingByUser };