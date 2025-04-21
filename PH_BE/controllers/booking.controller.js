const db = require("../models");
const Booking = db.booking
const Notification = db.notification
require("dotenv").config();
const server = require("../server");
const PayOS = require("@payos/node");
const payOS = new PayOS(
    process.env.Client_ID,
    process.env.Api_Key,
    process.env.Checksum_Key
);
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "namkhanh2703.work@gmail.com",
        pass: "tuff cyhw bwez qkcm",
    },
});
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
        const noti = new Notification({
            content: `${newBooking.guest_name} đã đặt lịch khám thú cưng`,
            type: "booking",

        })
        await noti.save();
        server.io.emit("newBooking", newBooking);
        res.status(201).json({ message: "Đặt lịch thành công!", booking: newBooking });
    } catch (error) {
        console.error("Lỗi API create booking:", error);
        res.status(500).json({ message: "Lỗi server!" });
    }
};

const GetAllBooking = async (req, res) => {
    try {
        const userId = req.userId;
        const bookings = await Booking.find({ status: { $ne: "pending" }, doctor_id: userId }).populate("doctor_id").populate("pet_id")
        return res.status(200).json(bookings);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi khi lấy danh sách booking", error });
    }
}
const GetAllBookingByStaffandAdmin = async (req, res) => {
    try {
        const bookings = await Booking.find({
            status: { $ne: "pending" },
            doctor_id: { $ne: null, $exists: true }
        })
            .populate("doctor_id")
            .populate("pet_id")
            .sort({ createdAt: -1 });
        return res.status(200).json(bookings);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi khi lấy danh sách booking", error });
    }
}
const AssignDoctor = async (req, res) => {
    try {
        const { doctor_id } = req.body
        const booking_id = req.params.id;
        const booking = await Booking.findByIdAndUpdate(booking_id, { doctor_id: doctor_id, status: "confirm" }, { new: true }).populate("doctor_id");

        await transporter.sendMail({
            to: booking.guest_email,
            subject: "Xác nhận đặt lịch khám tại PetCare",
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
                    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
                        
                        <!-- Logo -->
                        <div style="text-align: center; margin-bottom: 20px;">
                            <img src="https://res.cloudinary.com/debx8syhr/image/upload/v1742756437/SDN301m/tnwxuppwnwsyfueef090.png" alt="PetCare Logo" width="120">
                        </div>
        
                        <h2 style="color: #2c3e50; text-align: center;">Xác nhận lịch hẹn khám thú cưng</h2>
                        <p style="text-align: center; color: #555;">Chào <b>${booking?.guest_name}</b>,</p>
                        
                        <p style="color: #555;">Bạn đã đặt lịch khám thành công tại <b>PetCare</b>. Dưới đây là thông tin chi tiết:</p>
        
                        <div style="background: #ecf7ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                            <p><strong>Bác sĩ phụ trách:</strong> ${booking.doctor_id.username}</p>
                            <p><strong>Ngày khám:</strong> ${new Date(booking.date).toLocaleDateString('vi-VN')}</p>
                            <p><strong>Thời gian:</strong> ${booking?.hour}</p>
                            <p><strong>Địa điểm:</strong> PetCare Hospital - Hòa Lạc, Hà Nội</p>
                        </div>
        
                        <p style="color: #555;">Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.</p>
        
                        <!-- Button CTA -->
                        <div style="text-align: center; margin-top: 20px;">
                            <a href="https://pethospital.onrender.com/history-booking" 
                               style="display: inline-block; padding: 12px 24px; background: #3498db; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 5px;">
                               Xem chi tiết lịch hẹn
                            </a>
                        </div>
        
                        <p style="margin-top: 20px; text-align: center; font-size: 12px; color: #7f8c8d;">
                            Pet Hospital - Hotline: 0123-456-789
                        </p>
        
                        <!-- Footer -->
                        <div style="text-align: center; margin-top: 20px;">
                            <a href="https://facebook.com/petcare" style="margin: 0 10px;">
                                <img src="https://your-petcare-website.com/icons/facebook.png" width="24">
                            </a>
                            <a href="https://instagram.com/petcare" style="margin: 0 10px;">
                                <img src="https://your-petcare-website.com/icons/instagram.png" width="24">
                            </a>
                            <a href="https://your-petcare-website.com" style="margin: 0 10px;">
                                <img src="https://your-petcare-website.com/icons/website.png" width="24">
                            </a>
                        </div>
        
                    </div>
                </div>
            `,
        }).catch(err => console.error("Mail Error:", err));

        return res.status(200).json({ message: "Cập nhật bác sĩ thành công!" });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi khi lấy danh sách booking", error });
    }
}
const UpdateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, hour, service_id, sub_service_id, note, doctor_id } = req.body;
        const booking = await Booking.findByIdAndUpdate(
            id,
            { date, hour, service_id, sub_service_id, note, doctor_id },
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
    const ordercode = parseInt(Date.now().toString().slice(-7) + Math.floor(100 + Math.random() * 900));
    const paymentLinkBody = {
        orderCode: ordercode,
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
                "payment.qrcode": paymentLinkRes.qrCode,
                "payment.orderCode": ordercode
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
        if (!updatedBooking) {
            console.log("Booking not found for orderCode:", orderCode);

        }
        const st = Booking.findOne({ "payment.order_code": orderCode })
        console.log(data);
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
    GetAllBookingByStatus, CreatePaymentBooking, receivehook, UpdateBookingPaymentCash,
    GetAllBookingByStaffandAdmin
};

