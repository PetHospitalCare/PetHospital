const db = require("../models");
const Payment = db.payment;
const { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } = require('vnpay');

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
                status: 1
            });
        }

        if (payment) {
            savedPayment = await payment.save();
        }


        if (shoppingCart) {
            await shoppingCart.deleteOne({ userId: String(userId) });
        }

        return res.status(200).json({
            success: true,
            message: 'Thanh toán code thành công',
            savedPayment,
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};

module.exports = { paymentVNPay, updatePayment, getPaymentsByUserId, paymentCodPay };