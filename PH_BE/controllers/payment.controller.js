const db = require("../models");
const Payment = db.payment;
const { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } = require('vnpay');
const nodemailer = require("nodemailer");
const Account = db.account;
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "namkhanh2703.work@gmail.com",
        pass: "tuff cyhw bwez qkcm",
    },
});

const paymentVNPay = async (req, res) => {
    try {
        const { userId } = req.params;
        const data = req.body;
        let payment;
        let shoppingCart;

        if (userId && userId !== 'contact_infor') {
            shoppingCart = await db.shoppingcart.findOne({ userId: String(userId) });

            if (!shoppingCart) {
                console.log('Không tìm thấy cart')

                return res.status(500).json({
                    message: "Lỗi hệ thống Back-end"
                });
            }

            payment = new Payment({
                userId: shoppingCart.userId,
                contactInfo: '',
                items: shoppingCart.items,
                totalPrice: shoppingCart.totalPrice,
                shipFee: shoppingCart.shipFee,
                address: shoppingCart.address,
                status: 0
            });
        } else if (userId && userId === 'contact_infor') {
            payment = new Payment({
                userId: '',
                contactInfo: userId,
                items: data.items,
                totalPrice: data.totalPrice,
                shipFee: data.shipFee,
                address: data.address,
                status: 0
            });
        }

        const savedPayment = await payment.save();

        const vnpay = new VNPay({
            tmnCode: 'RCS7ES46',
            secureSecret: '4TKTBYQ9H25SR8BITLS6BR60XEOHPWDO',
            vnpayHost: 'https://sandbox.vnpayment.vn',
            testMode: true,
            hashAlgorithm: 'SHA512',
            enableLog: false,
            loggerFn: ignoreLogger,
        });

        const now = new Date();

        const paymentUrl = vnpay.buildPaymentUrl({
            vnp_Amount: savedPayment.totalPrice + savedPayment.shipFee,
            vnp_IpAddr: '127.0.0.1',
            vnp_TxnRef: savedPayment._id,
            vnp_OrderInfo: savedPayment._id,
            vnp_OrderType: ProductCode.Other,
            vnp_ReturnUrl: 'http://localhost:5173/payment-result',
            vnp_Locale: VnpLocale.VN,
            vnp_CreateDate: dateFormat(now),
            vnp_ExpireDate: dateFormat(new Date(now.getTime() + 15 * 60 * 1000))
        })

        if (shoppingCart) {
            await shoppingCart.deleteOne({ userId: String(userId) });
        }

        return res.status(200).json({
            success: true,
            message: 'Tạo bản ghi và url thành công',
            paymentUrl,
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};

const updatePayment = async (req, res) => {
    try {
        const data = req.body;
        let paymentSaved;

        if (data.paymentId) {
            let payment = await db.payment.findOne({ _id: String(data.paymentId) });

            if (payment) {
                if (data.vnp_ResponseCode === '00') {
                    payment.status = 1;
                } else {
                    payment.status = -1;
                }

                paymentSaved = await payment.save();
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'Cập nhật payment không thành công',
                });
            }
        }

        if (paymentSaved.status === 1) {
            const emailResult = await sendEmailSuccessPayment(paymentSaved, paymentSaved.userId);

            if (!emailResult.success) {
                console.log('Cảnh báo: ' + emailResult.message);
            }
        }

        return res.status(200).json({
            success: true,
            message: 'Cập nhật payment thành công',
            paymentSaved,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};

const getPaymentsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'UserId không được cung cấp'
            });
        }

        const payments = await db.payment.find({ userId: String(userId) });

        if (!payments || payments.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'Không tìm thấy payment nào cho người dùng này',
                payments: []
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Lấy danh sách payment thành công',
            payments,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống Back-end"
        });
    }
};

const paymentCodPay = async (req, res) => {
    try {
        const { userId } = req.params;
        const data = req.body;
        let payment = null;
        let shoppingCart;
        let savedPayment = null;

        if (userId && userId !== 'contact_infor') {
            shoppingCart = await db.shoppingcart.findOne({ userId: String(userId) });

            if (!shoppingCart) {
                console.log('Không tìm thấy cart');
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy giỏ hàng của người dùng"
                });
            }

            payment = new Payment({
                userId: shoppingCart.userId,
                contactInfo: '',
                items: shoppingCart.items,
                totalPrice: shoppingCart.totalPrice,
                shipFee: shoppingCart.shipFee,
                address: shoppingCart.address,
                status: 1
            });
        }

        if (payment) {
            savedPayment = await payment.save();
        } else {
            return res.status(400).json({
                success: false,
                message: "Không thể tạo đơn hàng"
            });
        }

        if (shoppingCart) {
            await shoppingCart.deleteOne({ userId: String(userId) });
        }

        const emailResult = await sendEmailSuccessPayment(savedPayment, userId);

        if (!emailResult.success) {
            console.log('Cảnh báo: ' + emailResult.message);
            // Vẫn tiếp tục xử lý đơn hàng dù gửi email bị lỗi
        }

        return res.status(200).json({
            success: true,
            message: 'Thanh toán COD thành công',
            savedPayment,
        });

    } catch (error) {
        console.log('Lỗi trong quá trình thanh toán:', error);

        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống Back-end"
        });
    }
};

const sendEmailSuccessPayment = async (paymentInput, userKeyInput) => {
    try {
        // Kiểm tra xem các tham số cần thiết đã được truyền vào chưa
        if (!paymentInput || !userKeyInput) {
            console.error("Thiếu dữ liệu paymentInput hoặc userKeyInput");
            return { success: false, message: "Thiếu dữ liệu để gửi email" };
        }

        const user = await Account.findOne({ _id: userKeyInput });

        if (!user) {
            console.error("Không tìm thấy user với userKey:", userKeyInput);
            return { success: false, message: "Không tìm thấy user!" };
        }

        // Định dạng tiền tệ
        const formattedPrice = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(paymentInput.totalPrice + (paymentInput.shipFee || 0));

        // Tạo danh sách sản phẩm trong email
        const itemsList = paymentInput.items.map(item => `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(item.price)}</td>
            </tr>
        `).join('');

        await transporter.sendMail({
            to: user.email,
            subject: "Thông tin đơn hàng - PetCare",
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
                    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
                        
                        <div style="text-align: center; margin-bottom: 20px;">
                            <img src="/pethospital.png" alt="" width="120">
                        </div>
        
                        <h2 style="color: #2c3e50; text-align: center;">Xác nhận đặt hàng thành công</h2>
                        <p style="text-align: center; color: #555;">Chào <b>${user?.username || 'Quý khách'}</b>,</p>
                        
                        <p style="color: #555;">Bạn đã đặt đơn hàng thành công tại <b>PetCare</b>. Dưới đây là thông tin chi tiết:</p>
        
                        <div style="background: #ecf7ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                            <p><strong>Mã đơn hàng:</strong> #${paymentInput._id}</p>
                            <p><strong>Ngày đặt:</strong> ${new Date(paymentInput.createdAt).toLocaleDateString('vi-VN')}</p>
                            <p><strong>Địa chỉ giao hàng:</strong> ${paymentInput.address}</p>
                            <p><strong>Phí vận chuyển:</strong> ${new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(paymentInput.shipFee || 0)}</p>
                            <p><strong>Tổng tiền:</strong> ${formattedPrice}</p>
                        </div>
                        
                        <h3 style="color: #2c3e50;">Chi tiết sản phẩm</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background-color: #f2f2f2;">
                                    <th style="padding: 12px 8px; text-align: left;">Sản phẩm</th>
                                    <th style="padding: 12px 8px; text-align: center;">Số lượng</th>
                                    <th style="padding: 12px 8px; text-align: right;">Giá</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsList}
                            </tbody>
                        </table>
        
                        <p style="color: #555; margin-top: 20px;">Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua hotline: <strong>+84 0985741249</strong>.</p>
        
                        <div style="text-align: center; margin-top: 20px;">
                            <a href="http://localhost:5173/orders" 
                               style="display: inline-block; padding: 12px 24px; background: #3498db; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 5px;">
                               Xem lại đơn hàng của bạn
                            </a>
                        </div>
        
                        <p style="margin-top: 20px; text-align: center; font-size: 12px; color: #7f8c8d;">
                            Địa chỉ: Văn phòng Pet Health, Tòa nhà Sông Đà, Số 54 Phạm Hùng, Nam Từ Liêm, TP. Hà Nội
                        </p>
        
                        <div style="text-align: center; margin-top: 20px;">
                            <a href="https://facebook.com/petcare" style="margin: 0 10px; color: #3b5998; text-decoration: none;">
                                Facebook
                            </a>
                            <a href="https://instagram.com/petcare" style="margin: 0 10px; color: #e4405f; text-decoration: none;">
                                Instagram
                            </a>
                            <a href="https://your-petcare-website.com" style="margin: 0 10px; color: #0077b5; text-decoration: none;">
                                Website
                            </a>
                        </div>
        
                    </div>
                </div>
            `,
        });

        return { success: true, message: "Gửi email thanh toán thành công!" };
    } catch (error) {
        console.error("Lỗi khi gửi email:", error);
        return { success: false, message: "Lỗi khi gửi email thanh toán!", error };
    }
};


const getAllPayments = async (req, res) => {
    try {
        const payments = await db.payment.find();

        if (!payments || payments.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'Không tìm thấy payment nào',
                payments: []
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Lấy toàn bộ danh sách payment thành công',
            payments,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống Back-end"
        });
    }
};

module.exports = { paymentVNPay, updatePayment, getPaymentsByUserId, paymentCodPay, getAllPayments };