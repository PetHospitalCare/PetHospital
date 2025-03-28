const db = require("../models");
const Booking = db.booking
require("dotenv").config();
const server = require("../server");
const PayOS = require("@payos/node");
const payOS = new PayOS(
    process.env.Client_ID,
    process.env.Api_Key,
    process.env.Checksum_Key
);
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

}
const getBookingbyId = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id).populate("doctor_id").populate("pet_id").populate("account_id");
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }
        res.status(200).json({ success: true, booking });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi khi lấy danh sách booking", error });
    }
}

const getBookingByUser = async (req, res) => {
    try {
        const userId = req.userId;

        const userBooking = await Booking.find({ account_id: userId }).populate("doctor_id").populate("pet_id").populate("service_id")
        if (!userBooking) {
            return res.status(404).json({ success: false, message: "Không tìm thấy thông tin đặt lịch khám của người dùng" });
        }

        res.status(200).json({ success: true, booking: userBooking });

    }
    catch (error) {
        return res.status(500).json({ message: "Lỗi khi lấy danh sách booking", error });
    }
};
const CancelBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedBooking = await Booking.findByIdAndUpdate(
            id,
            { status: "cancel" },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy lịch hẹn"
            });
        }

        res.status(200).json({
            success: true,
            message: "Hủy lịch hẹn thành công",
            data: updatedBooking
        });

    }
    catch (error) {
        return res.status(500).json({ message: "Lỗi khi lấy danh sách booking", error });
    }
};
const GetAllBookingByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const bookings = await Booking.find({ status: status }).populate("doctor_id").populate("pet_id")
        return res.status(200).json(bookings);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi khi lấy danh sách booking", error });
    }
}
const CreatePaymentBooking = async (req, res) => {
    const { booking_id } = req.params;
    const booking = await Booking.findById(booking_id);
    if (booking?.payment?.qrcode) {
        return res.status(200).json({
            qrcode: booking.payment.qrcode,

        });
    }
    const paymentLinkBody = {
        orderCode: booking.payment.order_code,
        amount: booking.price,
        description: `Thanh toán ${booking.payment.order_code}`,
        cancelUrl: `${process.env.FRONT_END_URL}`,
        returnUrl: `${process.env.FRONT_END_URL}`,
    };
    const paymentLinkRes = await payOS.createPaymentLink(paymentLinkBody);
    const updatedBooking = await Booking.findByIdAndUpdate(
        booking_id,
        {
            $set: {
                "payment.qrcode": paymentLinkRes.qrCode
            }
        },
        { new: true } // Trả về document sau khi update
    );
    return res.status(200).json({
        qrcode: paymentLinkRes.qrCode,

        // checkoutUrl: paymentLinkRes.qrCode,
        // checkoutlink: paymentLinkRes.checkoutUrl,
        // bankAccount: paymentLinkRes.accountNumber,
        // bankName: "Ngân hàng TMCP Quân đội",
        // amount: total_price,
        // accountHolder: paymentLinkRes.accountName
    });
}
const receivehook = async (req, res) => {
    const { data } = req.body;
    const { orderCode, code } = data;
    console.log(orderCode);
    if (code === "00") {
        console.log("Code hihihi")
        const updatedBooking = await Booking.findOneAndUpdate(
            {
                "payment.order_code": orderCode
            },
            {
                $set: { "payment.status": true, "payment.date": new Date(), "payment.method": "transfer" }
            },
            {
                new: true, // Trả về document sau khi update
            }
        )
        if (!updatedBooking ) {
            console.log("Booking not found for orderCode:", orderCode);

        }
        const st = Booking.findOne({ "payment.order_code": orderCode })
        console.log("test:", st)
        console.log(updatedBooking);
        server.io.emit("payment_success", updatedBooking)
        return res.status(200).json({
            // checkoutUrl: paymentLinkRes.qrCode,
            // checkoutlink: paymentLinkRes.checkoutUrl,
            // bankAccount: paymentLinkRes.accountNumber,
            // bankName: "Ngân hàng TMCP Quân đội",
            // amount: total_price,
            // accountHolder: paymentLinkRes.accountName
        });
    }
}
const UpdateBookingPaymentCash = async (req, res) => {
    try {
        const { id } = req.params;
        const bookings = await Booking.findByIdAndUpdate(id, { $set: { "payment.status": true, "payment.date": new Date(), "payment.method": "cash" } }, { new: true });

        return res.status(200).json();
    } catch (error) {
        return res.status(500).json({ message: "Lỗi khi lấy danh sách booking", error });
    }
}
module.exports = {
    CreateNewBooking, GetAllBooking, AssignDoctor, UpdateBooking, getBookingByUser, getBookingbyId, CancelBookingById,
    GetAllBookingByStatus, CreatePaymentBooking, receivehook, UpdateBookingPaymentCash
};

